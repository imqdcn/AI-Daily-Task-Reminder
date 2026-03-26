const { GoogleGenerativeAI } = require('@google/generative-ai');
const notifier = require('node-notifier');
const { v4: uuidv4 } = require('uuid');
const { addReminder } = require('./db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

/**
 * 根据任务生成AI提醒
 */
async function generateAIReminder(task) {
  try {
    const prompt = `
你是一个专业的社媒内容创作提醒助手。根据以下任务，生成一个具体、可执行的提醒建议。

任务标题: ${task.title}
任务描述: ${task.description}
分类: ${task.category}
优先级: ${task.priority === 1 ? '低' : task.priority === 2 ? '中' : '高'}
计划时间: ${task.target_time}

请生成：
1. 一个简短的提醒文本（20-30字）
2. 详细的执行建议（50-100字）
3. 可能的资源或工具建议

格式：
[提醒文本]
[执行建议]
[资源建议]
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `系统提示：你是一个专业的社媒内容创作助手，提供实用的日程管理和内容创意建议。\n\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    });

    const content = result.response.text();
    const parts = content.split('\n[');
    
    return {
      reminder: parts[0].trim().replace('[', ''),
      suggestion: parts[1]?.split(']')?.[0] || '执行此任务',
      resources: parts[2]?.split(']')?.[0] || '根据需要查阅相关资源',
    };
  } catch (error) {
    console.error('AI提醒生成失败:', error);
    return {
      reminder: `提醒：${task.title}`,
      suggestion: task.description || '开始完成这项任务',
      resources: '根据需要准备相关资源',
    };
  }
}

/**
 * 发送系统通知
 */
async function sendNotification(task, aiReminder) {
  return new Promise((resolve) => {
    const reminderId = uuidv4();
    
    notifier.notify({
      title: `📌 ${task.title}`,
      message: aiReminder.reminder,
      sound: true,
      wait: true,
      timeout: 10,
      open: 'http://localhost:3000',
    }, async (err, response, metadata) => {
      if (!err) {
        // 保存提醒到数据库
        try {
          await addReminder({
            id: reminderId,
            task_id: task.id,
            reminder_text: aiReminder.reminder,
            ai_suggestion: aiReminder.suggestion,
          });
        } catch (dbErr) {
          console.error('保存提醒失败:', dbErr);
        }
      }
      resolve();
    });
  });
}

/**
 * 处理任务并发送提醒
 */
async function processTaskReminder(task) {
  try {
    console.log(`处理任务提醒: ${task.title}`);
    
    // 生成AI提醒
    const aiReminder = await generateAIReminder(task);
    
    // 发送系统通知
    await sendNotification(task, aiReminder);
    
    return {
      success: true,
      reminder: aiReminder,
    };
  } catch (error) {
    console.error('处理任务提醒失败:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 定期检查并处理待提醒的任务
 */
async function checkAndRemindTasks(tasks) {
  const now = new Date();
  const results = [];

  for (const task of tasks) {
    if (task.status === 'completed') continue;

    // 检查是否到了提醒时间（计划时间前5分钟）
    if (task.target_time) {
      const targetTime = new Date(task.target_time);
      const timeDiff = targetTime - now;
      const fiveMinutes = 5 * 60 * 1000;

      if (timeDiff > 0 && timeDiff <= fiveMinutes) {
        const result = await processTaskReminder(task);
        results.push(result);
      }
    }
  }

  return results;
}

module.exports = {
  generateAIReminder,
  sendNotification,
  processTaskReminder,
  checkAndRemindTasks,
};
