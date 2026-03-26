# AI Daily Task Reminder

一个为社媒博主打造的 AI 驱动的日程管理和提醒系统。通过 OpenAI 的自然语言能力，为你的每日任务生成智能提醒和执行建议。

## 🎯 核心功能

- **智能任务管理**：创建、编辑、删除和追踪日常任务
- **AI 提醒生成**：基于 ChatGPT 的智能提醒文案生成
- **系统通知**：操作系统级别的桌面通知提醒
- **多优先级**：支持高、中、低三个优先级
- **分类管理**：针对社媒运营的预设分类（内容创作、素材准备、视频剪辑等）
- **定时提醒**：在计划时间前 5 分钟自动发送提醒
- **Web 界面**：现代化的响应式 Web 管理界面

## 📦 技术栈

- **后端**：Node.js + Express
- **数据库**：SQLite3
- **AI**：OpenAI API (GPT-3.5-turbo)
- **通知**：node-notifier (系统通知)
- **前端**：原生 HTML/CSS/JavaScript

## 🚀 快速开始

### 前置要求

- Node.js 16+
- npm 或 yarn
- OpenAI API Key（[免费获取](https://platform.openai.com/api-keys)）

### 安装步骤

1. **克隆或进入项目目录**
   ```bash
   cd f:\AIProject\EnglishApp
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   # 复制示例文件
   copy .env.example .env
   
   # 编辑 .env 文件，添加你的 OpenAI API Key
   # OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **启动应用**
   ```bash
   npm start
   ```

5. **打开浏览器**
   访问 http://localhost:3000

## 📱 使用指南

### 创建任务

1. 在左侧表单填写：
   - **任务标题**：必填，清楚描述要做的事
   - **任务描述**：可选，提供更多细节
   - **分类**：选择适当的内容类型
   - **优先级**：高/中/低
   - **计划时间**：任务预计完成时间

2. 点击「添加任务」创建

### 获取 AI 提醒

有两种方式：

#### 自动提醒（推荐）
- 系统每 60 秒检查一次
- 在计划时间前 5 分钟自动发送系统通知
- AI 会生成：
  - 简短的提醒文本（通知中显示）
  - 详细的执行建议
  - 相关资源或工具建议

#### 手动提醒
- 在任务卡片上点击「🔔 提醒我」按钮
- 立即获取 AI 生成的提醒

### 管理任务

- **完成**：点击「✓ 完成」标记完成
- **删除**：点击「🗑 删除」移除任务
- **查看统计**：顶部显示总任务、已完成、待处理数量

## 🔧 API 文档

### 获取所有任务
```http
GET /api/tasks
```

### 创建新任务
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "拍摄抖音视频",
  "description": "准备开学季内容",
  "category": "内容创作",
  "priority": 3,
  "target_time": "2024-03-26T14:00:00Z"
}
```

### 获取任务提醒历史
```http
GET /api/tasks/:id/reminders
```

### 手动触发提醒
```http
POST /api/tasks/:id/remind
```

### 更新任务状态
```http
PATCH /api/tasks/:id
Content-Type: application/json

{
  "status": "completed"
}
```

### 删除任务
```http
DELETE /api/tasks/:id
```

### 健康检查
```http
GET /api/health
```

## 📊 数据库架构

### tasks 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键（UUID） |
| title | TEXT | 任务标题 |
| description | TEXT | 任务描述 |
| category | TEXT | 分类 |
| priority | INTEGER | 优先级（1-3） |
| status | TEXT | 状态（pending/completed） |
| target_time | DATETIME | 计划完成时间 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |
| completed_at | DATETIME | 完成时间 |

### reminders 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 主键（UUID） |
| task_id | TEXT | 关联任务 ID |
| reminder_text | TEXT | 提醒文案 |
| ai_suggestion | TEXT | AI 建议 |
| sent_at | DATETIME | 发送时间 |
| dismissed_at | DATETIME | 忽略时间 |

## 🎬 工作流示例

### 社媒博主的典型工作日

1. **早上 9:00** - 打开应用，创建今日任务
   - 拍摄抖音视频（目标 14:00）
   - 准备小红书文案（目标 16:00）
   - 数据分析（目标 18:00）

2. **计划时间前 5 分钟** - 收到系统通知
   ```
   📌 拍摄抖音视频
   "现在是开始拍摄的好时机！建议先检查光线和背景..."
   ```

3. **完成任务** - 点击完成按钮
   系统自动记录完成时间

4. **回顾统计** - 查看今日完成情况

## 🛠️ 开发模式

使用 nodemon 进行自动重启开发：

```bash
npm run dev
```

## 📁 项目结构

```
.
├── src/
│   ├── server.js        # Express 服务器和 API
│   ├── db.js            # 数据库操作
│   └── aiReminder.js    # AI 提醒逻辑
├── public/
│   └── index.html       # Web 界面
├── data/
│   └── tasks.db         # SQLite 数据库文件
├── .env                 # 环境变量（不提交）
├── .env.example         # 环境变量示例
├── package.json         # 项目依赖
└── README.md           # 项目文档
```

## 🔐 安全性建议

1. **API Key 管理**
   - 不要在代码中硬编码 API Key
   - 使用 `.env` 文件存储敏感信息
   - 不要提交 `.env` 文件到 Git

2. **个人数据**
   - 任务数据本地保存在 SQLite
   - 如无必要不要在网络传输中暴露

## 🐛 故障排除

### 问题：无法连接到 OpenAI API
- **原因**：API Key 无效或网络问题
- **解决**：检查 `.env` 中的 API Key 是否正确

### 问题：系统通知不显示
- **原因**：操作系统通知权限未授予
- **解决**：
  - Windows：检查通知和操作中心设置
  - Mac：打开系统偏好设置 > 通知 > Node

### 问题：数据库错误
- **原因**：目录权限或磁盘空间
- **解决**：检查 `data/` 目录权限，确保有足够空间

## 📝 常见问题

### Q: 支持离线使用吗？
A: 基础任务管理支持离线，但 AI 提醒需要网络连接和 OpenAI API。

### Q: 能否导出数据？
A: 目前数据保存在 SQLite 中，可以直接备份 `data/tasks.db` 文件。

### Q: 支持多用户吗？
A: 目前是单用户设计，计划在未来增加多用户支持。

## 🚦 路线图

- [ ] 用户认证和多用户支持
- [ ] 任务重复提醒（每天、每周等）
- [ ] 更丰富的 AI 功能（内容建议生成）
- [ ] 移动应用版本
- [ ] 与钉钉、企业微信集成
- [ ] 导出任务报告

## 📞 支持

如有问题或建议，欢迎反馈！

## 📄 许可

MIT License

---

**开始提醒你的每一天，让 AI 帮你规划内容创作之路！** 🚀
