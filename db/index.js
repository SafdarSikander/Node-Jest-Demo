const Database = require('better-sqlite3');
const db = new Database('dummy.db', { verbose: console.log });



module.exports = { db, Database };