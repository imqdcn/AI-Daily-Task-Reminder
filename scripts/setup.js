#!/usr/bin/env node

/**
 * 项目初始化脚本
 * 用于首次运行时设置数据库和环境
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');
const envFile = path.join(__dirname, '../.env');

console.log('🚀 AI Daily Task Reminder - 初始化');
console.log('=====================================\n');

// 1. 检查 .env 文件
if (!fs.existsSync(envFile)) {
  console.log('❌ 未找到 .env 文件');
  console.log('请运行以下命令创建配置：');
  console.log('  cp .env.example .env');
  console.log('然后编辑 .env 文件，填入你的 Gemini API Key\n');
  process.exit(1);
}

// 2. 检查 GEMINI_API_KEY
const envContent = fs.readFileSync(envFile, 'utf-8');
if (!envContent.includes('GEMINI_API_KEY=') || envContent.includes('your_gemini_api_key')) {
  console.log('⚠️  警告：Gemini API Key 未配置或配置不正确');
  console.log('AI 提醒功能需要有效的 API Key\n');
}

// 3. 创建数据目录
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ 已创建数据目录\n');
}

// 4. 输出启动信息
console.log('✅ 初始化完成！');
console.log('\n开发模式启动：');
console.log('  npm run dev\n');
console.log('生产模式启动：');
console.log('  npm start\n');
console.log('应用地址：http://localhost:3000\n');
