const mysql = require('mysql2/promise');

// Aiven MySQL Cloud Database Configuration
// Replace these values with your actual Aiven MySQL credentials
const dbConfig = {
  host: process.env.DB_HOST || 'your-aiven-host.aivencloud.com',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD || 'your-password',
  database: process.env.DB_NAME || 'claras_best_kakanin',
  ssl: {
    rejectUnauthorized: true,
    // For Aiven, you may need to provide the CA certificate
    // ca: require('fs').readFileSync('./ca.pem')
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to Aiven MySQL Database successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

module.exports = { pool, testConnection };
