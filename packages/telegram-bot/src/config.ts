export interface WorkerConfig {
  telegramBotToken: string;
  telegramWebhookSecret: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  port: number;
  telegramMaxVoiceMessagesPerDay: number;
  enabled: boolean;
}

function positiveIntEnv(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function loadConfig(): WorkerConfig {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN ?? "";
  const telegramWebhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET ?? "";
  const openaiApiKey = process.env.OPENAI_API_KEY ?? "";
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY ?? "";

  return {
    telegramBotToken,
    telegramWebhookSecret,
    openaiApiKey,
    anthropicApiKey,
    port: positiveIntEnv(process.env.PORT, 8090),
    telegramMaxVoiceMessagesPerDay: positiveIntEnv(
      process.env.TELEGRAM_MAX_VOICE_MESSAGES_PER_DAY,
      7,
    ),
    enabled: Boolean(
      telegramBotToken && telegramWebhookSecret && openaiApiKey && anthropicApiKey,
    ),
  };
}
