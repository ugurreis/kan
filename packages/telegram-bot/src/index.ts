import { createServer } from "http";

import { webhookCallback } from "grammy";

import { createDrizzleClient } from "@kan/db/client";
import { createLogger } from "@kan/logger";

import { createBot } from "./bot";
import { loadConfig } from "./config";

const logger = createLogger("telegram-bot");

async function main() {
  const config = loadConfig();

  if (!config.enabled) {
    logger.warn(
      "TELEGRAM_BOT_TOKEN / secrets not fully configured — telegram-bot disabled (no-op HTTP server).",
    );
    createServer((_req, res) => {
      res.writeHead(200);
      res.end("telegram-bot disabled");
    }).listen(config.port);
    return;
  }

  // Aynı ephemeral-PGLite-fallback riski inbox-worker'da da vardı (bkz.
  // packages/inbox-worker/src/index.ts) — burada da fail-fast.
  if (!process.env.POSTGRES_URL) {
    throw new Error(
      "POSTGRES_URL is not set — refusing to start telegram-bot against the ephemeral PGLite fallback.",
    );
  }

  const db = createDrizzleClient();
  const bot = createBot(db, config);
  const handleWebhook = webhookCallback(bot, "http");

  const server = createServer((req, res) => {
    if (req.url !== "/telegram/webhook") {
      res.writeHead(404);
      res.end();
      return;
    }

    const secretHeader = req.headers["x-telegram-bot-api-secret-token"];
    if (secretHeader !== config.telegramWebhookSecret) {
      res.writeHead(401);
      res.end();
      return;
    }

    handleWebhook(req, res).catch((error: unknown) => {
      logger.error({ error }, "webhook handling failed");
      if (!res.headersSent) {
        res.writeHead(500);
        res.end();
      }
    });
  });

  server.listen(config.port, () => {
    logger.info({ port: config.port }, "telegram-bot listening");
  });
}

main().catch((error: unknown) => {
  logger.error({ error }, "telegram-bot crashed on startup");
  process.exit(1);
});
