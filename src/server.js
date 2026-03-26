const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const {
  initializeDatabase,
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  getReminders,
} = require('./db');
const { processTaskReminder, checkAndRemindTasks } = require('./aiReminder');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 定时检查任务提醒（每60秒检查一次）
let reminderInterval = null;

/**
 * 启动定时提醒检查
 */
function startReminderCheck() {
  reminderInterval = setInterval(async () => {
    try {
      const tasks = await getTasks('pending');
      const results = await checkAndRemindTasks(tasks);
      if (results.length > 0) {
        console.log(`已发送 ${results.length} 条提醒`);
      }
    } catch (error) {
      console.error('定时检查提醒失败:', error);
    }
  }, 60000); // 每60秒检查一次
}

// API 路由

/**
 * 获取所有待处理任务
 */
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await getTasks('pending');
    res.json(tasks);
  } catch (error) {
    console.error('获取任务失败:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 创建新任务
 */
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, category, priority, target_time } = req.body;

    if (!title) {
      return res.status(400).json({ error: '任务标题不能为空' });
    }

    const task = {
      id: uuidv4(),
      title,
      description: description || '',
      category: category || '其他',
      priority: priority || 2,
      target_time: target_time || new Date().toISOString(),
    };

    const result = await addTask(task);
    res.status(201).json(result);
  } catch (error) {
    console.error('创建任务失败:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 获取任务的所有提醒
 */
app.get('/api/tasks/:id/reminders', async (req, res) => {
  try {
    const reminders = await getReminders(req.params.id);
    res.json(reminders);
  } catch (error) {
    console.error('获取提醒失败:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 手动触发任务提醒
 */
app.post('/api/tasks/:id/remind', async (req, res) => {
  try {
    const tasks = await getTasks('pending');
    const task = tasks.find((t) => t.id === req.params.id);

    if (!task) {
      return res.status(404).json({ error: '任务未找到' });
    }

    const result = await processTaskReminder(task);
    res.json(result);
  } catch (error) {
    console.error('发送提醒失败:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 更新任务状态
 */
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: '状态不能为空' });
    }

    const updates = {
      status,
      ...(status === 'completed' && { completed_at: new Date().toISOString() }),
    };

    const result = await updateTask(req.params.id, updates);
    res.json(result);
  } catch (error) {
    console.error('更新任务失败:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 删除任务
 */
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await deleteTask(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('删除任务失败:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 健康检查
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
async function start() {
  try {
    console.log('初始化数据库...');
    await initializeDatabase();
    console.log('✅ 数据库初始化成功');

    app.listen(PORT, () => {
      console.log(`✅ 服务器运行在 http://localhost:${PORT}`);
      console.log('启动定时提醒检查...');
      startReminderCheck();
      console.log('✅ 定时提醒检查已启动（间隔60秒）');
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
}

start();

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到关闭信号');
  if (reminderInterval) clearInterval(reminderInterval);
  process.exit(0);
});
