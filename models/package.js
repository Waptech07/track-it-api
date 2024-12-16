import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export const createPackage = (packageData) => {
  const stmt = db.prepare(`
    INSERT INTO packages (id, tracking_code, status, days_remaining, delivery_date, last_checked, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const id = uuidv4();
  stmt.run(
    id,
    packageData.trackingCode,
    packageData.status,
    packageData.daysRemaining,
    packageData.deliveryDate.toISOString(),
    packageData.lastChecked.toISOString(),
    packageData.userId
  );
  
  return getPackageById(id);
};

export const getPackageByTrackingCode = (trackingCode) => {
  const stmt = db.prepare(`
    SELECT p.*, m.id as message_id, m.content, m.created_at, m.user_id as sender_id
    FROM packages p
    LEFT JOIN messages m ON p.id = m.package_id
    WHERE p.tracking_code = ?
    ORDER BY m.created_at DESC
  `);
  
  const rows = stmt.all(trackingCode);
  if (!rows.length) return null;
  
  // Group messages with package
  const pacKage = {
    ...rows[0],
    messages: rows.map(row => ({
      id: row.message_id,
      content: row.content,
      createdAt: row.created_at,
      senderId: row.sender_id
    })).filter(m => m.id) // Remove null messages
  };
  
  return pacKage;
};

export const getUserPackages = (userId) => {
  const stmt = db.prepare('SELECT * FROM packages WHERE user_id = ?');
  return stmt.all(userId);
};

export const updatePackageStatus = (id, status, daysRemaining) => {
  const stmt = db.prepare(`
    UPDATE packages 
    SET status = ?, days_remaining = ?, last_checked = ?
    WHERE id = ?
  `);
  
  return stmt.run(status, daysRemaining, new Date().toISOString(), id);
};