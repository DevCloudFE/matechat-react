export function getRandomId(length: number) {
  if (typeof window === "undefined") {
    return Math.random().toString(36).substring(2, length);
  }
  return window.crypto.randomUUID();
}
