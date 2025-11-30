import sqlite3 from 'sqlite3';
const sql = sqlite3.verbose();

function connected(err) {
    if (err) {
        console.log(err.message);
        return;
    }
    console.log('SQLite3 database: database.db created or already exists.');
}

const DB = new sql.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, connected);


// Create tables if they don’t exist
DB.serialize(() => { // runs them in order
  // Users table
  DB.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);

    // Calendars table
  DB.run(`
    CREATE TABLE IF NOT EXISTS calendars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NULL,
      title TEXT NOT NULL,
      duration INTEGER NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      info TEXT NULL,
      url TEXT NOT NULL,
      FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
    )
  `);
  
      // Friend Calendar information table
  DB.run(`
    CREATE TABLE IF NOT EXISTS calendar_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      calendar_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      preferences TEXT NOT NULL,
      hashed_id TEXT NOT NULL,
      FOREIGN KEY (calendar_id) REFERENCES calendars (id) ON DELETE CASCADE
    )
  `);
      // Reminders table
  
  DB.run(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id TEXT UNIQUE,
      username TEXT NOT NULL,
      friend TEXT NOT NULL,
      frequency INT NOT NULL,
      description TEXT NULL,
      FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
    )
  `);
  // DB.run(`UPDATE users SET mailing_list = NULL`);

  // friends table with foreign key reference to users.id
  DB.run(`
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      last_seen DATE,
      image_path TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
});


export { DB }