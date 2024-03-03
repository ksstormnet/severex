import Database from 'better-sqlite3';

const db = new Database('severex.db', { verbose: console.log });

console.log('Empty database severex.db has been created.');

// Close the database connection
db.close();
