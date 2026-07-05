import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { z } from "zod";

import * as workspaceRepo from "@kan/db/repository/workspace.repo";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getUserPermissions } from "../utils/permissions";

interface PerfRow {
  memberPublicId: string;
  name: string | null;
  email: string;
  image: string | null;
  assigned: string | number;
  completed: string | number;
  with_due: string | number;
  on_time: string | number;
  overdue: string | number;
}

export const analyticsRouter = createTRPCRouter({
  // SADECE workspace admini. Ekip üyelerini 3 kritere göre skorlar:
  // (1) tamamlanan kart sayısı, (2) zamanında teslim oranı, (3) geciken oranı.
  teamPerformance: protectedProcedure
    .input(z.object({ workspacePublicId: z.string().min(12) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user?.id;
      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });

      const workspace = await workspaceRepo.getByPublicId(
        ctx.db,
        input.workspacePublicId,
      );
      if (!workspace)
        throw new TRPCError({ code: "NOT_FOUND", message: "Workspace not found" });

      const perms = await getUserPermissions(ctx.db, userId, workspace.id);
      if (!perms || perms.role !== "admin")
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Bu sayfayı yalnızca yöneticiler görebilir",
        });

      const result = await ctx.db.execute(sql`
        SELECT
          wm."publicId" AS "memberPublicId",
          u.name AS name,
          u.email AS email,
          u.image AS image,
          COUNT(c.id) FILTER (WHERE c."deletedAt" IS NULL) AS assigned,
          COUNT(c.id) FILTER (WHERE c.completed AND c."deletedAt" IS NULL) AS completed,
          COUNT(c.id) FILTER (WHERE c."dueDate" IS NOT NULL AND c."deletedAt" IS NULL) AS with_due,
          COUNT(c.id) FILTER (WHERE c.completed AND c."dueDate" IS NOT NULL AND c."completedAt" <= c."dueDate" AND c."deletedAt" IS NULL) AS on_time,
          COUNT(c.id) FILTER (WHERE c."dueDate" IS NOT NULL AND c."deletedAt" IS NULL AND ((c.completed AND c."completedAt" > c."dueDate") OR (NOT c.completed AND c."dueDate" < now()))) AS overdue
        FROM workspace_members wm
        JOIN "user" u ON u.id = wm."userId"
        LEFT JOIN _card_workspace_members cwm ON cwm."workspaceMemberId" = wm.id
        LEFT JOIN card c ON c.id = cwm."cardId"
        LEFT JOIN list l ON l.id = c."listId"
        LEFT JOIN board b ON b.id = l."boardId" AND b."workspaceId" = ${workspace.id} AND b."deletedAt" IS NULL
        WHERE wm."workspaceId" = ${workspace.id} AND wm."deletedAt" IS NULL
        GROUP BY wm."publicId", u.name, u.email, u.image
        ORDER BY completed DESC, on_time DESC
      `);

      const rows = (result.rows ?? []) as unknown as PerfRow[];

      return rows.map((r) => {
        const assigned = Number(r.assigned);
        const completed = Number(r.completed);
        const withDue = Number(r.with_due);
        const onTime = Number(r.on_time);
        const overdue = Number(r.overdue);
        const onTimeRate = withDue > 0 ? Math.round((onTime / withDue) * 100) : null;
        const overdueRate = withDue > 0 ? Math.round((overdue / withDue) * 100) : null;
        // Bileşik skor: tamamlama hacmi + zamanında oran − geciken oran (0..)
        const score = Math.max(
          0,
          Math.round(completed * 10 + (onTimeRate ?? 0) - (overdueRate ?? 0) * 1.5),
        );
        return {
          memberPublicId: r.memberPublicId,
          name: r.name,
          email: r.email,
          image: r.image,
          assigned,
          completed,
          withDue,
          onTime,
          overdue,
          onTimeRate,
          overdueRate,
          score,
        };
      });
    }),
});
