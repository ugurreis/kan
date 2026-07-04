export interface WorkerConfig {
  imapHost: string;
  imapPort: number;
  imapUser: string;
  imapPassword: string;
  pollSeconds: number;
  requireFromMatch: boolean;
  maxPerHour: number;
  enabled: boolean;
}

export function loadConfig(): WorkerConfig {
  const imapHost = process.env.INBOX_IMAP_HOST ?? "";
  const imapUser = process.env.INBOX_IMAP_USER ?? "";
  const imapPassword = process.env.INBOX_IMAP_PASSWORD ?? "";

  return {
    imapHost,
    imapPort: Number(process.env.INBOX_IMAP_PORT ?? 993),
    imapUser,
    imapPassword,
    pollSeconds: Number(process.env.INBOX_POLL_SECONDS ?? 60),
    requireFromMatch:
      (process.env.INBOX_REQUIRE_FROM_MATCH ?? "true") !== "false",
    maxPerHour: Number(process.env.INBOX_MAX_ITEMS_PER_USER_PER_HOUR ?? 100),
    enabled: Boolean(imapHost && imapUser && imapPassword),
  };
}
