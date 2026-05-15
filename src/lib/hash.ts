/** SHA-256 of a string, returned as lowercase hex. */
export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Format a hex string into uppercase, space-separated groups for display. */
export function groupHex(hex: string, groupSize = 4): string {
  const upper = hex.toUpperCase();
  const groups = upper.match(new RegExp(`.{1,${groupSize}}`, 'g'));
  return groups ? groups.join(' ') : upper;
}
