const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/tasks.db');

let db = null;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) reject(err);
      
      db.serialize(() => {
        // 任务表
        db.run(`
          CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT,
            priority INTEGER DEFAULT 1,
            status TEXT DEFAULT 'pending',
            target_time TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME
          )
        `);

        // AI提醒日志
        db.run(`
          CREATE TABLE IF NOT EXISTS reminders (
            id TEXT PRIMARY KEY,
            task_id TEXT,
            reminder_text TEXT,
            ai_suggestion TEXT,
            sent_at DATETIME,
            dismissed_at DATETIME,
            FOREIGN KEY (task_id) REFERENCES tasks(id)
          )
        `);

        // 用户偏好设置
        db.run(`
          CREATE TABLE IF NOT EXISTS preferences (
            key TEXT PRIMARY KEY,
            value TEXT
          )
        `, (err) => {
          if (err) reject(err);
          else resolve(db);
        });
      });
    });
  });
}

function getDatabase() {
  return db;
}

function addTask(task) {
  return new Promise((resolve, reject) => {
    const { id, title, description, category, priority, target_time } = task;
    db.run(
      `INSERT INTO tasks (id, title, description, category, priority, target_time)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, title, description, category, priority, target_time],
      function(err) {
        if (err) reject(err);
        else resolve({ id, ...task });
      }
    );
  });
}

function getTasks(status = 'pending') {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM tasks WHERE status = ? ORDER BY priority DESC, target_time ASC`,
      [status],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

function updateTask(id, updates) {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    
    db.run(
      `UPDATE tasks SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values,
      (err) => {
        if (err) reject(err);
        else resolve({ id, ...updates });
      }
    );
  });
}

function deleteTask(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM tasks WHERE id = ?`, [id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function addReminder(reminder) {
  return new Promise((resolve, reject) => {
    const { id, task_id, reminder_text, ai_suggestion } = reminder;
    db.run(
      `INSERT INTO reminders (id, task_id, reminder_text, ai_suggestion, sent_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [id, task_id, reminder_text, ai_suggestion],
      (err) => {
        if (err) reject(err);
        else resolve(reminder);
      }
    );
  });
}

function getReminders(task_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM reminders WHERE task_id = ? ORDER BY sent_at DESC`,
      [task_id],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

module.exports = {
  initializeDatabase,
  getDatabase,
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  addReminder,
  getReminders,
};
