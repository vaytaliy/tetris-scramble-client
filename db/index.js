const { Pool, Client } = require('pg');

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,       //set up these parameters manually on local db environment
    port: process.env.DATABASE_PORT
})

const queryTable = async (text, params) => {
    const rows = await pool.query(text, params);
    return rows;
}

module.exports = {
    queryTable
}

