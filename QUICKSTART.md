# 🚀 快速开始指南

## 前置准备

### 1. 获取 OpenAI API Key
访问 https://platform.openai.com/api-keys 获取免费的 API Key

### 2. 配置环境变量
```bash
# 编辑 .env 文件
OPENAI_API_KEY=sk-your-key-here
PORT=3000
NODE_ENV=development
```

## 安装和运行

### 步骤 1: 安装依赖
```bash
npm install
```

### 步骤 2: 启动服务器
```bash
# 开发模式（自动重启）
npm run dev

# 或生产模式
npm start
```

### 步骤 3: 打开应用
在浏览器中访问：**http://localhost:3000**

## 首次使用

### 1️⃣ 创建任务
- 在左侧表单输入任务信息
- 填写标题（必填）、描述、分类、优先级
- 设置计划完成时间
- 点击「➕ 添加任务」

### 2️⃣ 获取 AI 提醒
**自动方式**：系统每 60 秒检查一次，在计划时间前 5 分钟自动发送提醒
**手动方式**：点击任务卡片上的「🔔 提醒我」按钮立即获取

### 3️⃣ 管理任务
- ✓ 完成：标记任务为已完成
- 🗑 删除：移除任务
- 📊 统计：顶部显示任务统计

## 常见分类

- 📹 **内容创作** - 拍摄、录制、剪辑视频
- 🎨 **素材准备** - 准备背景、道具、文案
- ✂️ **视频剪辑** - 后期处理和特效
- 📡 **直播** - 直播预计划和互动
- 📊 **数据分析** - 查看粉丝增长、互动数据
- 💬 **互动运营** - 回复评论、回访粉丝
- 📝 **其他** - 其他相关工作

## 优先级说明

| 优先级 | 标记 | 用途 |
|--------|------|------|
| 🔴 高 | 3 | 重要且紧急的任务 |
| 🟡 中 | 2 | 重要任务（默认） |
| 🟢 低 | 1 | 不紧急的任务 |

## 示例工作流

### 早上 9:00 - 制定计划
```
任务1: 拍摄新视频
- 时间: 14:00
- 分类: 内容创作
- 优先级: 高

任务2: 准备文案
- 时间: 11:00
- 分类: 素材准备
- 优先级: 中

任务3: 查看互动
- 时间: 18:00
- 分类: 互动运营
- 优先级: 低
```

### 计划时间前 5 分钟
系统通知示例：
```
📌 拍摄新视频
"现在是开始拍摄的好时机！建议先检查光线和背景...
现在是开始拍摄的好时机！建议先检查光线和背景..."
```

### 完成后
点击 ✓ 完成按钮，系统会：
- 标记任务为已完成
- 更新统计信息
- 记录完成时间

## API 端点参考

```bash
# 获取所有任务
curl http://localhost:3000/api/tasks

# 创建任务
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"新视频","priority":3}'

# 手动提醒
curl -X POST http://localhost:3000/api/tasks/{task_id}/remind

# 完成任务
curl -X PATCH http://localhost:3000/api/tasks/{task_id} \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# 删除任务
curl -X DELETE http://localhost:3000/api/tasks/{task_id}
```

## 常见问题

**Q: 为什么没有收到提醒？**
- A: 1) 确保 API Key 已正确配置 2) 检查计划时间是否正确 3) 关闭系统通知的勿扰模式

**Q: 能否修改检查间隔？**
- A: 可以，编辑 `src/server.js` 中第 15 行 `setInterval(..., 60000)` 的时间参数

**Q: 数据保存在哪里？**
- A: 本地 SQLite 数据库 `data/tasks.db`，可直接备份

**Q: 支持离线使用吗？**
- A: 任务管理支持，但 AI 提醒需要网络和 API Key

## 故障排除

### 错误：ENOTDIR
- 问题：数据目录不存在
- 解决：确保运行过 `npm start` 一次

### 错误：OPENAI_API_KEY not found
- 问题：.env 文件不存在或未配置
- 解决：创建 .env 文件并填入 API Key

### 系统通知不显示
- 问题：操作系统通知权限未开启
- 解决：
  - Windows: 设置 > 系统 > 通知和操作 > 允许应用发送通知
  - Mac: 系统偏好设置 > 通知 > 允许 Node

## 下一步

- 📚 阅读完整的 [README.md](../README.md)
- 🔧 查看 [.github/copilot-instructions.md](../.github/copilot-instructions.md)
- 📖 了解 API 设计细节

---

**需要帮助？** 查看应用中的开发控制台输出或 README.md 文档
