
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let svc;

const envVal = process.env.FIREBASE_SERVICE_ACCOUNT;
const secretFilePath = "/etc/secrets/serviceAccountKey.json"; // Render secret file location

// Helper to fix private_key newlines
function fixPrivateKey(obj) {
  if (obj && typeof obj.private_key === "string") {
    obj.private_key = obj.private_key.replace(/\\n/g, "\n");
  }
  return obj;
}

try {
  if (envVal) {
    // Case 1: Environment variable is set
    const trimmed = envVal.trim();
    if (trimmed.startsWith("{")) {
      // JSON directly in env
      svc = JSON.parse(trimmed);
    } else {
      // Treat as path from env
      const potentialPath = path.isAbsolute(envVal)
        ? envVal
        : path.resolve(process.cwd(), envVal);
      svc = JSON.parse(fs.readFileSync(potentialPath, "utf8"));
    }
  } else if (fs.existsSync(secretFilePath)) {
    // Case 2: Render secret file
    const fileContents = fs.readFileSync(secretFilePath, "utf8");
    svc = JSON.parse(fileContents);
  } else {
    // Case 3: Local fallback
    const localPath = path.resolve(process.cwd(), "./serviceAccountKey.json");
    const fileContents = fs.readFileSync(localPath, "utf8");
    svc = JSON.parse(fileContents);
  }

  // Always fix private_key newlines
  svc = fixPrivateKey(svc);
} catch (err) {
  console.error("Failed to load Firebase service account:", err);
  throw err;
}

// Initialize admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(svc),
  });
}

export default admin;
