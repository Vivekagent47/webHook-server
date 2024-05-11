// Right now using nanoid@3 because from nanoid@4 ESM is not supported in the nanoid
// build code by Nestjs is in ESM format, which is breaking the build
// So, we are using nanoid@3 for now
import { customAlphabet } from "nanoid";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 16);

export function createId(prefix: string) {
  return `${prefix}_${nanoid()}`;
}
