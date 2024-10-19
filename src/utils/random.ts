import crypto from "crypto";

export const generateUniqueName = (): string => {
  const randomString = crypto.randomBytes(8).toString("hex");

  return randomString;
};
