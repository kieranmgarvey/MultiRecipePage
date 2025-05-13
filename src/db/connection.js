const mysql = require('mysql2');
require('dotenv').config(); 

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Password123$#',
    database: process.env.DB_NAME || 'recipe_site',
    multipleStatements: true // Enable multiple statements
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
        connection.release();
    }
});

module.exports = pool.promise();