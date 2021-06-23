export function getRandomUint8Array(length) {
  const salt = new Uint8Array(length);
  window.crypto.getRandomValues(salt);
  return salt;
}
