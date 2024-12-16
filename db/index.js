import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'database.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');

// Initialize database
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

export default db;