import crypto from "crypto";

/**
 * Zero-knowledge encryption utility.
 * AES-256-CBC. Never returns plaintext; never stores plaintext.
 * Key must be 32 bytes. We derive a stable 32-byte key from ENCRYPTION_KEY via SHA-256
 * so users can pass any length string in their .env.
 */

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) {
    throw new Error("ENCRYPTION_KEY is not set");
  }
  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

/** Encrypt a plaintext string into "iv:ciphertext" base64 payload. */
export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  return `${iv.toString("base64")}:${encrypted.toString("base64")}`;
}

/** Decrypt a payload produced by encrypt(). Throws on invalid/malformed payload. */
export function decrypt(payload: string): string {
  const [ivB64, dataB64] = payload.split(":");
  if (!ivB64 || !dataB64) {
    throw new Error("Malformed encrypted payload");
  }
  const iv = Buffer.from(ivB64, "base64");
  const data = Buffer.from(dataB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), iv);
  const decrypted = Buffer.concat([
    decipher.update(data),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}