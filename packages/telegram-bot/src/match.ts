const TURKISH_MAP: Record<string, string> = {
  ı: "i",
  İ: "i",
  ğ: "g",
  Ğ: "g",
  ü: "u",
  Ü: "u",
  ş: "s",
  Ş: "s",
  ö: "o",
  Ö: "o",
  ç: "c",
  Ç: "c",
};

function normalize(input: string): string {
  return input
    .split("")
    .map((ch) => TURKISH_MAP[ch] ?? ch)
    .join("")
    .toLowerCase()
    .trim();
}

export function matchOne(
  guess: string | null,
  candidates: Array<{ id: string; name: string }>,
): string | null {
  const normalizedGuess = guess ? normalize(guess) : "";
  if (!normalizedGuess || candidates.length === 0) return null;

  const matches = candidates.filter((candidate) => {
    const normalizedName = normalize(candidate.name);
    return (
      normalizedName.includes(normalizedGuess) ||
      normalizedGuess.includes(normalizedName)
    );
  });

  return matches.length === 1 ? matches[0]!.id : null;
}
