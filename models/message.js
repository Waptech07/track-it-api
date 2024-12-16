import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export const createMessage = (messageData) => {
  const stmt = db.prepare(`
    INSERT INTO messages (id, content, user_id, package_id)
    VALUES (?, ?, ?, ?)
  `);
  
  const id = uuidv4();
  stmt.run(id, messageData.content, messageData.userId, messageData.packageId);
  return getMessageById(id);
};

export const getMessageById = (id) => {
  const stmt = db.prepare('SELECT * FROM messages WHERE id = ?');
  return stmt.get(id);
};

export const getPackageMessages = (packageId) => {
  const stmt = db.prepare(`
    SELECT m.*, u.name as sender_name
    FROM messages m
    JOIN users u ON m.user_id = u.id
    WHERE m.package_id = ?
    ORDER BY m.created_at DESC
  `);
  return stmt.all(packageId);
};