import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync } from 'fs';
import Database from 'better-sqlite3';

const dbName = './serverex.db';

interface UserRow {
  id: number;
  twitter_handle: string;
}

describe('SQLite Database', () => {
  let db = new Database(dbName, { verbose: console.log });

  beforeAll(() => {
    // Ensure the database exists
    expect(existsSync(dbName)).toBe(true);
    // Initialize the database
    db = new Database(dbName, { verbose: console.log });
    // Run migration (including Users table creation for this example)
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        twitter_handle TEXT UNIQUE NOT NULL
      );`;
    db.exec(createUsersTable);
  });

  it('should allow user data insertion and retrieval', () => {
    // Insert data into Users table
    const insert = db.prepare('INSERT INTO Users (twitter_handle) VALUES (?)').run('@exampleUser');
    expect(insert.lastInsertRowid).toBeDefined();

    // Verify data insertion
    const row = db.prepare('SELECT * FROM Users WHERE id = ?').get(insert.lastInsertRowid) as UserRow;
    expect(row).toBeDefined();
    expect(row.twitter_handle).toBe('@exampleUser');
  });

  // Add more tests here for CRUD operations on Users, Triggers, etc.

  afterAll(() => {
    // Clean up: drop tables and close the database
    db.prepare('DROP TABLE IF EXISTS Users').run();
    // Add drop statements for other tables as needed
    db.close();
  });
});
