import { describe, expect, it, vi } from "vitest";

vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [
            {
              type: "tool_use",
              name: "submit_tasks",
              input: {
                tasks: [
                  {
                    title: "Çekim organizasyonu",
                    description: null,
                    dueDateISO: "2026-07-07",
                    boardNameGuess: "TT Firması",
                    assigneeNameGuess: null,
                  },
                ],
              },
            },
          ],
        }),
      },
    })),
  };
});

import { segmentTranscript } from "./segment";

describe("segmentTranscript", () => {
  it("parses the tool_use block into ParsedTask[]", async () => {
    const result = await segmentTranscript("sk-ant-test", "TT firmasına çekim, hemen", {
      nowISO: "2026-07-07T00:00:00.000Z",
      boards: [{ name: "TT Firması", members: [] }],
    });

    expect(result).toEqual([
      {
        title: "Çekim organizasyonu",
        description: null,
        dueDateISO: "2026-07-07",
        boardNameGuess: "TT Firması",
        assigneeNameGuess: null,
      },
    ]);
  });

  it("returns an empty array when Claude returns no tool_use block", async () => {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    (Anthropic as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => ({
        messages: { create: vi.fn().mockResolvedValue({ content: [] }) },
      }),
    );

    const result = await segmentTranscript("sk-ant-test", "anlaşılmaz", {
      nowISO: "2026-07-07T00:00:00.000Z",
      boards: [],
    });

    expect(result).toEqual([]);
  });
});
