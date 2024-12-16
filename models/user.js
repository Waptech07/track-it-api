import db from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

export const createUser = (userData) => {
  const stmt = db.prepare(`
    INSERT INTO users (id, email, name, password, country)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const id = uuidv4();
  stmt.run(id, userData.email, userData.name, userData.password, userData.country);
  return getUserById(id);
};

export const getUserByEmail = (email) => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
};

export const getUserById = (id) => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
};

export const updateUserPassword = (id, password) => {
  const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
  return stmt.run(password, id);
};

export const getAllUsers = () => {
  const stmt = db.prepare(`
    SELECT id, email, name, country, registration_date
    FROM users WHERE role = 'user'
  `);
  return stmt.all();
};

export const deleteUser = (id) => {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  return stmt.run(id);
};