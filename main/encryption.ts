import crypto from "crypto";

function deriveKey(password: string, salt: string | Buffer) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256"); // 32 bytes for AES-256
}

export function encrypt(text: string, password: string) {
  const iv = crypto.randomBytes(16); // Secure IV
  const salt = crypto.randomBytes(16); // Random salt for key derivation
  const key = deriveKey(password, salt); // Derive key from password

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex"); // Authentication tag
  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    authTag,
    salt: salt.toString("hex"),
  };
}

type decryptoArgs = {
  encryptedData: string;
  iv: string;
  authTag: string;
  salt: string;
  password: string;
};

export function decrypt({
  encryptedData,
  iv,
  authTag,
  salt,
  password,
}: decryptoArgs) {
  const key = deriveKey(password, Buffer.from(salt, "hex"));
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex")); // Set auth tag for verification

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
