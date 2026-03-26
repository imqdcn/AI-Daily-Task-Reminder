# Node.js 版本更新指南

## ⚠️ 问题

当前系统的 Node.js 版本为 **v14.21.3**，过于老旧。
该项目要求 Node.js **16+** 以支持现代 JavaScript 特性。

## 🔧 解决方案

### 方案 1: 使用 NVM（推荐）

NVM (Node Version Manager) 可以轻松管理多个 Node.js 版本。

#### Windows 用户：使用 nvm-windows

1. 下载 nvm-windows：https://github.com/coreybutler/nvm-windows/releases
   - 下载 `nvm-setup.exe`

2. 安装 nvm-windows

3. 在 PowerShell 中运行（以**管理员**身份）：
   ```powershell
   nvm list available
   nvm install 18.19.0
   nvm use 18.19.0
   node --version
   ```

#### Mac/Linux 用户：使用 nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

nvm list-remote
nvm install 18.19.0
nvm use 18.19.0

node --version
```

### 方案 2: 直接从官网升级

1. 访问 https://nodejs.org
2. 下载 LTS 版本（18.x 或 20.x）
3. 安装程序将自动升级

### 方案 3: 使用包管理器

**Windows (Chocolatey)**：
```powershell
choco upgrade nodejs
```

**Mac (Homebrew)**：
```bash
brew upgrade node
```

## ✅ 验证安装

升级完成后，确认版本：

```bash
node --version  # 应该显示 v16+ 或更高
npm --version   # 应该显示 8+
```

## 🚀 继续安装

版本确认后，重新运行：

```bash
cd f:\AIProject\EnglishApp
npm install
npm start
```

## 📋 推荐版本

- **LTS (稳定)**：16.x, 18.x, 20.x
- **最新**：21.x

推荐使用 **Node.js 18.x** 或 **20.x LTS**。

---

**完成后，回到项目目录继续安装！**
