import { randomUUID } from "crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

import { createDrizzleClient } from "@kan/db/client";
import {
  boards,
  boardToWorkspaceMembers,
  lists,
  users,
  workspaceMembers,
  workspaces,
} from "@kan/db/schema";
import { generateUID } from "@kan/shared/utils";
import * as boardRepo from "./board.repo";

const db = createDrizzleClient();

describe("board.repo — getAssignableContextByUserId", () => {
  let userAId: string;
  let activeMemberUserId: string;
  let removedMemberUserId: string;
  let workspaceAId: number;
  let workspaceBId: number;
  let boardA1Id: number;
  let boardA1PublicId: string;
  let boardB1PublicId: string;
  let activeMemberPublicId: string;
  let removedMemberPublicId: string;

  beforeAll(async () => {
    const [userA] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        name: "Test User A",
        email: `test-userA-${randomUUID()}@example.com`,
        emailVerified: true,
      })
      .returning({ id: users.id });
    userAId = userA!.id;

    // Two more real users so the project-team members have a linked `user.name`
    // (getAssignableContextByUserId requires a non-empty name to include a member).
    const [activeMemberUser] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        name: "Active Member",
        email: `test-active-member-${randomUUID()}@example.com`,
        emailVerified: true,
      })
      .returning({ id: users.id });
    activeMemberUserId = activeMemberUser!.id;

    const [removedMemberUser] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        name: "Removed Member",
        email: `test-removed-member-${randomUUID()}@example.com`,
        emailVerified: true,
      })
      .returning({ id: users.id });
    removedMemberUserId = removedMemberUser!.id;

    // Workspace A — user A is an active member here.
    const [workspaceA] = await db
      .insert(workspaces)
      .values({
        publicId: generateUID(),
        name: "Workspace A",
        slug: `workspace-a-${randomUUID()}`,
        createdBy: userAId,
      })
      .returning({ id: workspaces.id });
    workspaceAId = workspaceA!.id;

    // Workspace B — user A does NOT belong to this workspace.
    const [workspaceB] = await db
      .insert(workspaces)
      .values({
        publicId: generateUID(),
        name: "Workspace B",
        slug: `workspace-b-${randomUUID()}`,
        createdBy: userAId,
      })
      .returning({ id: workspaces.id });
    workspaceBId = workspaceB!.id;

    // User A's active membership in workspace A.
    await db.insert(workspaceMembers).values({
      publicId: generateUID(),
      email: "usera@example.com",
      userId: userAId,
      workspaceId: workspaceAId,
      createdBy: userAId,
      role: "admin",
      status: "active",
    });

    // A second, active project-team member in workspace A (not soft-deleted).
    const [activeMember] = await db
      .insert(workspaceMembers)
      .values({
        publicId: generateUID(),
        email: "activemember@example.com",
        userId: activeMemberUserId,
        workspaceId: workspaceAId,
        createdBy: userAId,
        role: "member",
        status: "active",
      })
      .returning({ id: workspaceMembers.id, publicId: workspaceMembers.publicId });
    activeMemberPublicId = activeMember!.publicId;

    // A soft-deleted project-team member in workspace A — must be excluded,
    // even though it has a linked user with a name (isolates the deletedAt filter).
    const [removedMember] = await db
      .insert(workspaceMembers)
      .values({
        publicId: generateUID(),
        email: "removedmember@example.com",
        userId: removedMemberUserId,
        workspaceId: workspaceAId,
        createdBy: userAId,
        role: "member",
        status: "active",
        deletedAt: new Date(),
      })
      .returning({ id: workspaceMembers.id, publicId: workspaceMembers.publicId });
    removedMemberPublicId = removedMember!.publicId;

    // Board A1 in workspace A.
    const [boardA1] = await db
      .insert(boards)
      .values({
        publicId: generateUID(),
        name: "Board A1",
        slug: `board-a1-${randomUUID()}`,
        workspaceId: workspaceAId,
        createdBy: userAId,
        type: "regular",
      })
      .returning({ id: boards.id, publicId: boards.publicId });
    boardA1Id = boardA1!.id;
    boardA1PublicId = boardA1!.publicId;

    // At least one list on board A1, so firstListPublicId is non-null.
    await db.insert(lists).values({
      publicId: generateUID(),
      name: "To Do",
      index: 0,
      boardId: boardA1Id,
      createdBy: userAId,
    });

    // Assign the active member and the soft-deleted member to board A1's project team.
    await db.insert(boardToWorkspaceMembers).values([
      { boardId: boardA1Id, workspaceMemberId: activeMember!.id },
      { boardId: boardA1Id, workspaceMemberId: removedMember!.id },
    ]);

    // Board B1 in workspace B — user A has no membership here.
    const [boardB1] = await db
      .insert(boards)
      .values({
        publicId: generateUID(),
        name: "Board B1",
        slug: `board-b1-${randomUUID()}`,
        workspaceId: workspaceBId,
        createdBy: userAId,
        type: "regular",
      })
      .returning({ id: boards.id, publicId: boards.publicId });
    boardB1PublicId = boardB1!.publicId;
  });

  afterAll(async () => {
    await db.delete(boards).where(eq(boards.workspaceId, workspaceAId));
    await db.delete(boards).where(eq(boards.workspaceId, workspaceBId));
    await db
      .delete(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceAId));
    await db.delete(workspaces).where(eq(workspaces.id, workspaceAId));
    await db.delete(workspaces).where(eq(workspaces.id, workspaceBId));
    await db.delete(users).where(eq(users.id, userAId));
    await db.delete(users).where(eq(users.id, activeMemberUserId));
    await db.delete(users).where(eq(users.id, removedMemberUserId));
  });

  it("only returns boards from the user's own workspaces", async () => {
    const result = await boardRepo.getAssignableContextByUserId(db, userAId);
    expect(result.map((b) => b.boardPublicId)).toContain(boardA1PublicId);
    expect(result.map((b) => b.boardPublicId)).not.toContain(boardB1PublicId);
  });

  it("excludes soft-deleted project members", async () => {
    const result = await boardRepo.getAssignableContextByUserId(db, userAId);
    const boardA1 = result.find((b) => b.boardPublicId === boardA1PublicId);
    expect(boardA1?.members.map((m) => m.memberPublicId)).not.toContain(
      removedMemberPublicId,
    );
  });

  it("includes the active project member and the first list's publicId", async () => {
    const result = await boardRepo.getAssignableContextByUserId(db, userAId);
    const boardA1 = result.find((b) => b.boardPublicId === boardA1PublicId);
    expect(boardA1?.firstListPublicId).not.toBeNull();
    expect(boardA1?.members.map((m) => m.memberPublicId)).toEqual([
      activeMemberPublicId,
    ]);
  });
});
