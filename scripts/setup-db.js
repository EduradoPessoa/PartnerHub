import { createPool } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: POSTGRES_URL or DATABASE_URL environment variable is missing.');
    console.log('Please create a .env file with your connection string.');
    console.log('Example: POSTGRES_URL=postgres://user:password@host/dbname?sslmode=require');
    process.exit(1);
  }

  const pool = createPool({
    connectionString: connectionString,
  });

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  try {
    console.log('Connecting to database...');
    console.log('Running schema migration...');
    
    // Execute the SQL
    await pool.query(schemaSql);
    
    console.log('✅ Schema created successfully!');
    console.log('Tables created: users, opportunities, commissions, timesheet');
  } catch (err) {
    console.error('❌ Error running migration:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
