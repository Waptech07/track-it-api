import "dotenv/config";
import pkg from "pg";
const { Client } = pkg;

export const client = new Client({
  connectionString: process.env.DATABASE_URL,
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
