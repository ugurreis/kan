import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const length = 24; // Fits Telegram's 64-char /start limit

const nanoid = customAlphabet(alphabet, length);

export function generateTelegramLinkToken() {
  return nanoid();
}
