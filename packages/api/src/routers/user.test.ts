import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@kan/db/repository/telegramLink.repo", () => ({
  getLinkByUserId: vi.fn(),
  deleteByUserId: vi.fn(),
  createLinkToken: vi.fn(),
}));

import * as telegramLinkRepo from "@kan/db/repository/telegramLink.repo";

describe("user.getTelegramLinkStatus / generateTelegramLinkToken / disconnectTelegram", () => {
  const mockUser = { id: "user-1", email: "a@b.com", name: "A" };
  const mockDb = {} as never;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TELEGRAM_BOT_USERNAME = "NexoviasBot";
  });

  it("reports linked:false when no link exists", async () => {
    const { userRouter } = await import("./user");
    (
      telegramLinkRepo.getLinkByUserId as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(undefined);
    const ctx = { user: mockUser, db: mockDb } as never;

    const res = await userRouter.createCaller(ctx).getTelegramLinkStatus();
    expect(res).toEqual({ linked: false });
  });

  it("generates a t.me deep link containing the bot username", async () => {
    const { userRouter } = await import("./user");
    const ctx = { user: mockUser, db: mockDb } as never;

    const res = await userRouter.createCaller(ctx).generateTelegramLinkToken();
    expect(res.url.startsWith("https://t.me/NexoviasBot?start=")).toBe(true);
  });

  it("disconnects by deleting the link", async () => {
    const { userRouter } = await import("./user");
    const ctx = { user: mockUser, db: mockDb } as never;

    const res = await userRouter.createCaller(ctx).disconnectTelegram();
    expect(res).toEqual({ success: true });
    expect(telegramLinkRepo.deleteByUserId).toHaveBeenCalledWith(
      mockDb,
      "user-1",
    );
  });
});
