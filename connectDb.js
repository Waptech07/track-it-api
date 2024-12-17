import { config } from './config/env.js';
import pkg from "pg";
const { Client } = pkg;

export const client = new Client({
  connectionString: config.databaseUrl, // Your DATABASE_URL environment variable
});

const connectDb = async () => {
  try {
    await client.connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit the app if connection fails
  }
};

export default connectDb;
