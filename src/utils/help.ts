import { randomBytes } from "crypto";

export function createId(prefix: string) {
  return `${prefix}_${randomBytes(16).toString("hex")}`;
}
