const {app} = require('electron');
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = app.isPackaged ? path.join(app.getPath('userData'), 'elstracker.db') : path.join(__dirname, 'elstracker.db');
const db = new Database(dbPath);

// ? run() INSERT/UPDATE/DELETE || get() SELECT -> row/undefined || all() SELECT -> array with all rows || prepare() VALUES(?).run(value)

db.exec(`

    CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        class TEXT,
        color TEXT
    );

    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon TEXT,
        title TEXT,
        reset TEXT CHECK(reset IN ('daily', 'weekly')),
        bound TEXT CHECK(bound IN ('character', 'account')),
        system INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS checklist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER,
        task_id INTEGER,
        completed INTEGER DEFAULT 0,
        enabled INTEGER DEFAULT 1,
        FOREIGN KEY (character_id) REFERENCES characters(id),
        FOREIGN KEY (task_id) REFERENCES tasks(id)
    );

    CREATE TABLE IF NOT EXISTS pity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id INTEGER,
        task_id INTEGER,
        percent REAL DEFAULT 0,
        FOREIGN KEY (character_id) REFERENCES characters(id),
        FOREIGN KEY (task_id) REFERENCES tasks(id)
    );

`);

const accountExists = db.prepare('SELECT COUNT(*) as count FROM characters WHERE id = 0').get();
if (accountExists.count === 0) {
    db.prepare('INSERT INTO characters (id, name, class, color) VALUES (?, ?, ?, ?)').run(0, 'Account', 'None', '#7a7a7a');
}


module.exports = db;