// config/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let svc;

const envVal = process.env.FIREBASE_SERVICE_ACCOUNT;

if (envVal) {
  // If env contains JSON object string, parse it. If it looks like a path, read the file.
  try {
    // Fast check: if it starts with "{" assume it's the JSON string
    const trimmed = envVal.trim();
    if (trimmed.startsWith("{")) {
      svc = JSON.parse(envVal);
    } else {
      // treat as a path to a json file
      const potentialPath = path.isAbsolute(envVal) ? envVal : path.resolve(process.cwd(), envVal);
      svc = JSON.parse(fs.readFileSync(potentialPath, "utf8"));
    }
  } catch (err) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT. If this env var is a path, ensure the path points to a valid JSON file. Error:", err);
    throw err;
  }
} else {
  // No env var — fallback to reading local serviceAccountKey.json
  try {
    svc = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "./serviceAccountKey.json"), "utf8"));
  } catch (err) {
    console.error("Failed to read ./serviceAccountKey.json. Make sure the file exists and is valid JSON.", err);
    throw err;
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(svc),
  });
}

export default admin;
