import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { client } from "../connectDb.js";
import { config } from "../config/env.js";

export const register = async (req, res) => {
  try {
    const { email, password, name, country } = req.body;

    if (!email || !password || !name || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await client.query(
      `SELECT * FROM users WHERE email = $1;`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      `
      INSERT INTO users (email, password, name, country)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, role;
    `,
      [email, hashedPassword, name, country]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    console.error("Error in register controller:", error.message, error.stack);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
  
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await client.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    // Query the user details from the database
    const result = await client.query(
      `SELECT id, email, name, role, country FROM users WHERE id = $1;`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // Send the user details in response
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      country: user.country,
    });
  } catch (error) {
    console.error("Error in fetchUser controller:", error.message, error.stack);
    res.status(500).json({ message: "Error fetching user details", error: error.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    const result = await client.query(
      `SELECT password FROM users WHERE id = $1;`,
      [userId]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await client.query(
      `
      UPDATE users
      SET password = $1
      WHERE id = $2;
    `,
      [hashedPassword, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password" });
  }
};
