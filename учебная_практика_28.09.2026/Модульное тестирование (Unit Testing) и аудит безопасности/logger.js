import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, 'app.log');

export function logError(message, error) {
  const timestamp = new Date().toISOString();

  const errorMessage =
    error instanceof Error
      ? error.message
      : String(error);

  const logEntry =
    `[${timestamp}] ERROR: ${message}. ${errorMessage}\n`;

  fs.appendFileSync(
    logFilePath,
    logEntry,
    'utf8'
  );
}
