const { Client } = require('pg');
const uri = "postgresql://postgres:Abhizero%40666@gcotzhkwcnqhcjuyzdjz.supabase.co:6543/postgres";
const client = new Client({ connectionString: uri, ssl: { rejectUnauthorized: false } });
client.connect()
  .then(() => { console.log('Connected to 6543'); client.end(); })
  .catch(err => console.error('Error 6543:', err.message));
