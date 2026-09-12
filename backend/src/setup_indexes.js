const { pool } = require('./db');

async function setupDatabaseIndexes() {
  const client = await pool.connect();
  try {
    console.log("Starting global database indexing...");

    // Find all tables in public schema
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);

    for (const row of tablesRes.rows) {
      const tableName = row.table_name;
      
      // Find all columns for this table
      const columnsRes = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [tableName]);

      const columns = columnsRes.rows.map(r => r.column_name);

      // We want to index 'status' and any column ending in '_id', '_no'
      const columnsToIndex = columns.filter(col => 
        col === 'status' || 
        col.endsWith('_id') || 
        col.endsWith('_no') ||
        col === 'customer' ||
        col === 'email'
      );

      for (const col of columnsToIndex) {
        const indexName = `idx_${tableName}_${col}`;
        try {
          await client.query(`CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${col})`);
          console.log(`Created index ${indexName}`);
        } catch (err) {
          console.error(`Failed to create index ${indexName}:`, err.message);
        }
      }
    }

    console.log("Global database indexing complete.");
  } catch (error) {
    console.error("Error setting up indexes:", error);
  } finally {
    client.release();
  }
}

setupDatabaseIndexes();
