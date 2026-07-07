import { describe, expect, it } from "vitest";

import { matchOne } from "./match";

describe("matchOne", () => {
  const candidates = [
    { id: "b1", name: "TT Firması" },
    { id: "b2", name: "X Firması" },
    { id: "b3", name: "Acme Şirketi" },
  ];

  it("matches ignoring case and Turkish characters", () => {
    expect(matchOne("tt firması", candidates)).toBe("b1");
    expect(matchOne("TT FIRMASI", candidates)).toBe("b1");
  });

  it("matches on substring containment (either direction)", () => {
    expect(matchOne("TT", candidates)).toBe("b1");
    expect(matchOne("Acme", candidates)).toBe("b3");
  });

  it("returns null when guess is null or empty", () => {
    expect(matchOne(null, candidates)).toBeNull();
    expect(matchOne("", candidates)).toBeNull();
    expect(matchOne("   ", candidates)).toBeNull();
  });

  it("returns null when no candidate matches", () => {
    expect(matchOne("bilinmeyen şirket", candidates)).toBeNull();
  });

  it("returns null when more than one candidate matches (ambiguous)", () => {
    const ambiguous = [
      { id: "b1", name: "Firma" },
      { id: "b2", name: "Firma A" },
    ];
    expect(matchOne("Firma", ambiguous)).toBeNull();
  });

  it("returns null on empty candidate list", () => {
    expect(matchOne("TT", [])).toBeNull();
  });

  it("never matches a candidate with an empty/blank normalized name", () => {
    const withBlank = [
      { id: "b1", name: "Zeynep Holding" },
      { id: "b2", name: "   " },
    ];
    expect(matchOne("bambaşka bir metin", withBlank)).toBeNull();
  });
});
