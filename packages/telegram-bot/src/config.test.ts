import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { loadConfig } from "./config";

const ENV_KEYS = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_WEBHOOK_SECRET",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "PORT",
] as const;

describe("loadConfig", () => {
  const original: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      original[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  });

  it("is disabled when required env vars are missing", () => {
    expect(loadConfig().enabled).toBe(false);
  });

  it("is enabled when all required env vars are present", () => {
    process.env.TELEGRAM_BOT_TOKEN = "token";
    process.env.TELEGRAM_WEBHOOK_SECRET = "secret";
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";

    expect(loadConfig().enabled).toBe(true);
  });

  it("falls back to default port on non-numeric PORT", () => {
    process.env.PORT = "not-a-number";
    expect(loadConfig().port).toBe(8090);
  });
});
