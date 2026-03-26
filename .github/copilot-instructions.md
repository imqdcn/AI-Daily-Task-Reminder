<!-- AI 日程提醒应用开发指南 -->

## 项目概述
这是一个为社媒博主设计的 AI 驱动日程管理系统。核心功能是通过 ChatGPT 为用户的日常任务生成智能提醒和执行建议，并通过系统通知发送。

## 技术栈
- **后端**: Node.js + Express
- **数据库**: SQLite3  
- **AI**: OpenAI API (GPT-3.5-turbo)
- **通知**: node-notifier (系统通知)
- **前端**: HTML/CSS/JavaScript

## 文件结构
```
src/
  ├── server.js       # Express API 服务器
  ├── db.js           # SQLite 数据库操作
  └── aiReminder.js   # AI 提醒生成和通知逻辑
  
public/
  └── index.html      # Web 管理界面
```

## 关键功能

### 1. 任务管理
- 创建：POST /api/tasks (标题、描述、分类、优先级、时间)
- 查询：GET /api/tasks (获取待处理任务)
- 更新：PATCH /api/tasks/:id (更改状态)
- 删除：DELETE /api/tasks/:id

### 2. AI 提醒生成
在 `aiReminder.js` 中实现：
- `generateAIReminder(task)` - 调用 ChatGPT 生成提醒文案
- 提示词关键元素：任务标题、描述、分类、优先级、计划时间
- 输出格式：简短提醒（20-30字）+ 执行建议（50-100字）+ 资源建议

### 3. 系统通知
- 使用 node-notifier 发送桌面通知
- 每 60 秒检查一次待提醒任务
- 在计划时间前 5 分钟自动触发

### 4. 数据持久化
SQLite 两个主表：
- `tasks`: 任务信息
- `reminders`: 提醒历史（便于回顾）

## 开发注意事项

### 环境配置
- 必须设置 `OPENAI_API_KEY` 环境变量
- 使用 `.env` 文件，参考 `.env.example`

### 提醒生成优化
- 考虑针对社媒运营的特定提示词优化
- 可根据分类（内容创作/素材准备等）定制建议内容
- 错误处理：若 API 失败，提供通用提醒文案

### 性能考虑
- 定时检查间隔可调整（默认 60 秒）
- 数据库查询应考虑索引优化
- 考虑任务量大时的性能影响

## 常见修改场景

### 添加新的任务分类
编辑前端 HTML 中的 select 元素

### 调整提醒检查频率
修改 `server.js` 中 `setInterval` 的时间参数 (默认 60000ms)

### 修改 AI 提示词
编辑 `aiReminder.js` 中的 `prompt` 字符串

### 更改通知样式
修改 `aiReminder.js` 中 `notifier.notify()` 的配置

## 测试步骤
1. 创建测试任务
2. 手动调用 `/api/tasks/:id/remind` 端点测试提醒
3. 查看数据库中的 reminders 表验证记录

## 部署建议
- 使用进程管理器（如 PM2）保持服务运行
- 定期备份 SQLite 数据库文件
- 监控 OpenAI API 使用配额和成本
- 考虑添加日志记录到文件而非仅控制台

## 缩写和快捷方式
在开发时参考这些（使用 `/create-agent` 的 VS Code 快捷命令）
- 快速启动开发服务器：`npm run dev`
- 快速测试 API：使用 curl 或 Postman
- Database 重置：删除 `data/tasks.db` 重新运行应用
