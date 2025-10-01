import { createHmac } from "crypto";

export function isValidSignature(
  id: string | null,
  signature: string | null
): boolean {
  const secretKey = process.env.WP_SIGNATURE_SECRET;

  if (!id || !signature || !secretKey) {
    return false;
  }

  const expectedSignature = createHmac("sha256", secretKey)
    .update(id)
    .digest("hex");

  try {
    const isValid = Buffer.from(expectedSignature).equals(
      Buffer.from(signature)
    );
    return isValid;
  } catch {
    return false;
  }
}
