const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'vitaliy',
    host: 'localhost',
    database: process.env.PGDATABASE,
    password: process.env.PW1.toString(),       //this might be broken
    port: process.env.PGPORT
})

const queryTable = async (text, params) => {
    const rows = await pool.query(text, params);
    return rows;
}

module.exports = {
    queryTable
}

