import fs from "fs";
import crypto from "crypto";

console.log("Generating 2048-bit RSA key pair...");

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem"
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem"
  }
});

// Write to files
fs.writeFileSync("rsa_key.p8", privateKey);
fs.writeFileSync("rsa_key.pub", publicKey);
console.log("Saved private key to rsa_key.p8");
console.log("Saved public key to rsa_key.pub");

// Extract the base64 public key (remove headers/footers/newlines)
const cleanPubKey = publicKey
  .replace(/-----BEGIN PUBLIC KEY-----/, "")
  .replace(/-----END PUBLIC KEY-----/, "")
  .replace(/\s+/g, "");

console.log("\n--- Clean Base64 Public Key (for Snowflake) ---");
console.log(cleanPubKey);

console.log("\n--- SQL Command to set public key in Snowflake ---");
console.log(`ALTER USER MI12772 SET RSA_PUBLIC_KEY='${cleanPubKey}';`);
