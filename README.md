# NeoShell 🚀

<div align="center">

![NeoShell](https://img.shields.io/badge/NeoShell-2.0.0-blue?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-27.0.0-47848F?style=for-the-badge&logo=electron)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Modern SSH Client with Beautiful Glassmorphic UI**

*Built with Electron.js by [Adriyansyah MF](https://github.com/adriyansyah-mf)*

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Build](#-build) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 🎨 **Modern UI/UX**
- 💎 **Glassmorphism Design** - Beautiful frosted glass effect
- 🌈 **Gradient Themes** - Vibrant purple-blue gradients
- 💫 **Smooth Animations** - Polished interactions everywhere
- 🎭 **Dark Theme** - Optimized for long sessions

### 🔐 **SSH Connection Management**
- 💾 **Save Connections** - Store unlimited SSH connections
- 🔑 **Multiple Auth** - Password & SSH key support
- 🔒 **Encrypted Storage** - Credentials stored securely
- 🔍 **Quick Search** - Find servers instantly
- ⚡ **Quick Switcher** - Switch between servers with one click

### 💻 **Terminal Features**
- 🖥️ **Full Terminal Emulator** - Powered by xterm.js
- 📋 **Command Snippets** - One-click common commands
- ⚙️ **Custom Snippets** - Add your own commands
- 🎨 **256 Colors Support** - Full terminal colors
- 📏 **Auto-resize** - Fits perfectly to window

### 📁 **File Manager (SCP/SFTP)**
- 🎯 **Drag & Drop Upload** - Easiest way to upload files
- 📥 **One-Click Download** - Double-click to download
- 🔍 **File Search** - Find files quickly
- 📊 **Progress Tracking** - Real-time upload/download progress
- 🗂️ **File Operations** - Create folders, delete files
- 🌐 **Path Navigation** - Browse remote directories

### 🔔 **Smart Notifications**
- ✅ Success notifications (upload/download complete)
- ❌ Error notifications (connection failed, etc.)
- ℹ️ Info notifications (command executed, etc.)
- 🎨 Beautiful glassmorphic toast design
- ⏱️ Auto-dismiss after 5 seconds

---

## 📋 Requirements

- **Windows** 10/11 (64-bit)
- **Node.js** 16+ (for development)
- **Internet connection** (for initial setup)

---

## 🚀 Installation

### Option 1: Download Executable (Recommended)

1. Go to [Releases](https://github.com/adriyansyah-mf/NeoShell/releases)
2. Download latest version:
   - `NeoShell-Setup-2.0.0.exe` (Installer)
   - `NeoShell-Portable-2.0.0.exe` (Portable)
3. Run and install!

### Option 2: Build from Source

```bash
# Clone repository
git clone https://github.com/adriyansyah-mf/NeoShell.git
cd NeoShell

# Install dependencies
npm install

# Run in development mode
npm start

# Build executable
npm run build
```

---

## 🎯 Quick Start

### 1. Create Connection

1. Click **"+ New"** button
2. Fill in server details:
   - Connection Name: `My Server`
   - Host: `192.168.1.100`
   - Port: `22`
   - Username: `root`
3. Choose authentication:
   - **Password**: Enter password
   - **SSH Key**: Browse for private key
4. Click **"Save Connection"**

### 2. Connect to Server

1. Click **"Connect"** button on saved connection
2. Wait for connection to establish
3. Terminal ready to use! 🎉

### 3. Upload Files

1. Switch to **"File Manager"** tab
2. Drag files from File Explorer
3. Drop in NeoShell window
4. Files uploaded! ✅

### 4. Execute Commands

1. Click built-in snippet buttons:
   - 📋 List All
   - 💾 Disk Space
   - 🧠 Memory
   - 📊 Top
   - ⚙️ Processes
2. Or add custom snippets!

---

## ⌨️ Usage Guide

### Search Connections
```
Type in search box → Instant filter
```

### Quick Switch
```
Click ⚡ button → Search → Click connection → Switched!
```

### Command Snippets
```
Click snippet button → Command executed!
Add custom: Click "+ Add" → Enter command
```

### File Search
```
File Manager → Type filename → Found!
```

### Upload Files
```
Drag from File Explorer → Drop in app → Uploaded!
```

### Download Files
```
Double-click file → Choose location → Downloaded!
```

---

## 🔨 Build

### Development

```bash
npm start
```

### Production Build

```bash
# Build all (installer + portable)
npm run build

# Build installer only
npm run build:win

# Build portable only
npm run build:portable
```

Output files in `dist/` folder:
- `NeoShell-Setup-2.0.0.exe` (Installer)
- `NeoShell-Portable-2.0.0.exe` (Portable)

---

## 🖼️ Screenshots

### Welcome Screen
*Beautiful glassmorphic welcome screen with gradient background*

### Connection Manager
*Manage all your SSH connections in one place*

### Terminal
*Full-featured terminal with command snippets*

### File Manager
*Drag & drop file upload with progress tracking*

---

## 🛠️ Tech Stack

- **[Electron](https://www.electronjs.org/)** - Desktop framework
- **[ssh2](https://github.com/mscdex/ssh2)** - SSH client
- **[xterm.js](https://xtermjs.org/)** - Terminal emulator
- **[electron-store](https://github.com/sindresorhus/electron-store)** - Persistent storage
- **Node.js** - Runtime

---

## 📚 Documentation

- [Features Documentation](FEATURES.md)
- [Build Guide](BUILD_GUIDE.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Security Guide](SECURITY.md)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Adriyansyah Marzuuqi Farhan**

- GitHub: [@adriyansyah-mf](https://github.com/adriyansyah-mf)
- Website: [codermager.my.id](https://www.codermager.my.id/)
- LinkedIn: [adriyansyah-marzuuqi-farhan](https://linkedin.com/in/adriyansyah-marzuuqi-farhan-4210a81a6)
- Email: adriyansyahmf0@gmail.com

---

## 🙏 Acknowledgments

- Electron.js team for the amazing framework
- xterm.js for the terminal emulator
- ssh2 library for SSH connectivity
- All contributors and users!

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/adriyansyah-mf/NeoShell?style=social)
![GitHub forks](https://img.shields.io/github/forks/adriyansyah-mf/NeoShell?style=social)
![GitHub issues](https://img.shields.io/github/issues/adriyansyah-mf/NeoShell)
![GitHub pull requests](https://img.shields.io/github/issues-pr/adriyansyah-mf/NeoShell)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

<div align="center">

**Made with ❤️ by [Adriyansyah MF](https://github.com/adriyansyah-mf)**

*Security Software Engineer from Yogyakarta, Indonesia*

</div>
