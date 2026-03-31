import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;
  console.log('Testing Connection String:', connectionString?.replace(/:([^:@]+)@/, ':****@'));

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('SUCCESS: Connected to database');
    const res = await client.query('SELECT NOW()');
    console.log('Query Result:', res.rows[0]);
    await client.end();
  } catch (err: any) {
    console.error('FAILURE: Could not connect to database');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    if (err.stack) console.error('Stack Trace:', err.stack);
  }
}

testConnection();
