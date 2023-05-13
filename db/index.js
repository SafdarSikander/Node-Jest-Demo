import Database from 'better-sqlite3';
const db = new Database('dummy.db', { verbose: console.log });



export { db, Database };