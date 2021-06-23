export function getRandomUint8Array(length: number) {
  const salt = new Uint8Array(length);
  window.crypto.getRandomValues(salt);
  return salt;
}
