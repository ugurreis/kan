import Anthropic from "@anthropic-ai/sdk";

export interface ParsedTask {
  title: string;
  description: string | null;
  dueDateISO: string | null;
  boardNameGuess: string | null;
  assigneeNameGuess: string | null;
}

interface SegmentContext {
  nowISO: string;
  boards: Array<{ name: string; members: string[] }>;
}

const TOOL_NAME = "submit_tasks";

export async function segmentTranscript(
  anthropicApiKey: string,
  transcript: string,
  context: SegmentContext,
): Promise<ParsedTask[]> {
  const client = new Anthropic({ apiKey: anthropicApiKey });

  const boardList = context.boards
    .map((b) => `- ${b.name}${b.members.length ? ` (üyeler: ${b.members.join(", ")})` : ""}`)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 2048,
    system: `Sen bir görev-ayıklama asistanısın. Kullanıcının sesli mesajdan gelen transkriptini bir veya daha fazla göreve böl. Bugünün tarihi: ${context.nowISO}. "hemen"/"bugün"/"yarın"/"X gün sonra" gibi göreceli ifadeleri bu tarihe göre ISO 8601 tarihine çevir (yalnızca gün, saat gerekmez: YYYY-MM-DD). Kullanıcının mevcut panoları:\n${boardList || "(hiç pano yok)"}\nTranskriptte bir firma/proje adı geçiyorsa ve yukarıdaki listede benzer bir isim varsa boardNameGuess'e tam olarak o pano adını yaz; emin değilsen null bırak. Kişi adı geçiyorsa assigneeNameGuess'e yaz; emin değilsen null bırak. title ve description'ı transkriptle AYNI dilde üret — çevirme, kullanıcının kendi ifadesini koru. Asla tahmin uydurma — boş bırakmak, yanlış eşleştirmekten iyidir.`,
    messages: [{ role: "user", content: transcript }],
    tools: [
      {
        name: TOOL_NAME,
        description: "Ayıklanan görevleri gönder",
        input_schema: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: ["string", "null"] },
                  dueDateISO: { type: ["string", "null"] },
                  boardNameGuess: { type: ["string", "null"] },
                  assigneeNameGuess: { type: ["string", "null"] },
                },
                required: [
                  "title",
                  "description",
                  "dueDateISO",
                  "boardNameGuess",
                  "assigneeNameGuess",
                ],
              },
            },
          },
          required: ["tasks"],
        },
      },
    ],
    tool_choice: { type: "tool", name: TOOL_NAME },
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock =>
      block.type === "tool_use" && block.name === TOOL_NAME,
  );
  if (!toolUse) return [];

  const input = toolUse.input as { tasks: ParsedTask[] };
  return input.tasks;
}
