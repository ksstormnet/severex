import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync } from 'fs';
import Database from 'better-sqlite3';

const dbName = './severex.db';

interface TestRow {
 id: number;
 name: string;
}

describe('SQLite Database', () => {
let db = new Database(dbName, { verbose: console.log });

beforeAll(() => {
    // Check if the database file exists
    expect(existsSync(dbName)).toBe(true);
    // Open the database for further operations
    db = new Database(dbName, { verbose: console.log });
});

  it('should allow data insertion', () => {
 // Attempt to create a table and insert data
    const createTable = db.prepare('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)').run();
    expect(createTable).toBeDefined();

    const insert = db.prepare('INSERT INTO test (name) VALUES (?)').run('Test Name');
    expect(insert.lastInsertRowid).toBeDefined();

    // Verify data insertion
    const row = db.prepare('SELECT * FROM test WHERE id = ?').get(insert.lastInsertRowid) as TestRow;
    expect(row).toBeDefined();
    expect(row.name).toBe('Test Name');
 });

  afterAll(() => {
    // Clean up: delete test data and close the database
    db.prepare('DROP TABLE IF EXISTS test').run();
    db.close();
  });
});
