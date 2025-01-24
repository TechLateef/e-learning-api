function computeTime(stepSize: number = 30) {
  const date = new Date();
  const currentTime = Math.floor(date.getTime() / 1000); // Convert to seconds
  return Math.floor(currentTime / stepSize); // Return the counter
}

async function hmacSha1(secret: string, counter: number) {
  let utf8Encode = new TextEncoder();

  // Ensure secret is in bytes
  const key = utf8Encode.encode(secret);

  //convert the counter to an 8-bytes big-endian buffer
  const counterBuffer = new ArrayBuffer(8);
  const counterView = new DataView(counterBuffer);

  for (let i = 7; i >= 0; i--) {
    counterView.setUint8(i, counter & 0xff);
    counter >>= 8;
  }

  // Import the secret key for HMAC-SHA1
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: { name: "SHA-1" } },
    false,
    ["sign"]
  );

  //Generate the HMAC for the counter
  const hmac = await crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);

  return hmac;
}

function dynamicTruncation(hmac: ArrayBuffer): number {
  const hmacBytes = new Uint8Array(hmac);

  // Get the offset from the last byte of the HMAC
  const offset = hmacBytes[hmacBytes.length - 1] & 0x0f;

  // Extract 4 bytes starting from the offset
  const binaryCode =
    ((hmacBytes[offset] & 0x7f) << 24) | // Most significant byte
    ((hmacBytes[offset + 1] & 0xff) << 16) |
    ((hmacBytes[offset + 2] & 0xff) << 8) |
    (hmacBytes[offset + 3] & 0xff); // Least significant byte

  return binaryCode; // Return the 32-bit integer
}

async function generateTOTP(
  secret: string,
  timeStep: number = 30
): Promise<number> {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const counter = Math.floor(currentTime / timeStep); // Time-based counter

  // Generate the HMAC
  const hmac = await hmacSha1(secret, counter);

  // Perform dynamic truncation
  const binaryCode = dynamicTruncation(hmac);

  // Generate a 6-digit OTP
  const otp = binaryCode % 10 ** 6;

  return otp; // Return the final OTP
}

generateTOTP("MYSECRETKEY").then(console.log); // Outputs a 6-digit OTP
