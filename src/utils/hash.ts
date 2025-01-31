import crypto from "crypto";

export const hashString = (input: string) =>
  crypto.createHash("sha256").update(input).digest("hex").slice(0, 8);
