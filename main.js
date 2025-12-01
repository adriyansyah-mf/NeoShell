const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { Client } = require('ssh2');
const Store = require('electron-store');

// Secure storage untuk menyimpan koneksi
const store = new Store({
  encryptionKey: '9bef13e82c9d101ce2ab05d43f30f2aa42003635ab06df8c1ed83bfbe0683a60' // In production, gunakan key yang lebih secure
});

let mainWindow;
let sshConnections = new Map(); // Store active SSH connections

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.loadFile('index.html');
  
  // Open DevTools untuk debugging (comment jika tidak perlu)
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Disconnect semua SSH connections
  sshConnections.forEach((conn, id) => {
    if (conn.client) {
      conn.client.end();
    }
  });
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers

// Get saved connections
ipcMain.handle('get-connections', async () => {
  return store.get('connections', []);
});

// Save connection
ipcMain.handle('save-connection', async (event, connection) => {
  const connections = store.get('connections', []);
  
  if (connection.id) {
    // Update existing
    const index = connections.findIndex(c => c.id === connection.id);
    if (index !== -1) {
      connections[index] = connection;
    }
  } else {
    // Add new
    connection.id = Date.now().toString();
    connections.push(connection);
  }
  
  store.set('connections', connections);
  return connection;
});

// Delete connection
ipcMain.handle('delete-connection', async (event, id) => {
  const connections = store.get('connections', []);
  const filtered = connections.filter(c => c.id !== id);
  store.set('connections', filtered);
  return true;
});

// Browse for SSH key file
ipcMain.handle('browse-key-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'SSH Keys', extensions: ['pem', 'pub', 'key', '*'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Connect to SSH
ipcMain.handle('ssh-connect', async (event, connectionId, connectionData) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    
    // Prepare connection config
    const config = {
      host: connectionData.host,
      port: connectionData.port || 22,
      username: connectionData.username
    };
    
    // Add authentication method
    if (connectionData.authType === 'password') {
      config.password = connectionData.password;
    } else if (connectionData.authType === 'key') {
      try {
        if (connectionData.keyPath && fs.existsSync(connectionData.keyPath)) {
          config.privateKey = fs.readFileSync(connectionData.keyPath);
          if (connectionData.passphrase) {
            config.passphrase = connectionData.passphrase;
          }
        } else {
          return reject(new Error('SSH key file not found'));
        }
      } catch (err) {
        return reject(new Error(`Failed to read SSH key: ${err.message}`));
      }
    }
    
    conn.on('ready', () => {
      conn.shell((err, stream) => {
        if (err) {
          conn.end();
          return reject(err);
        }
        
        // Store connection
        sshConnections.set(connectionId, {
          client: conn,
          stream: stream
        });
        
        // Handle data from SSH
        stream.on('data', (data) => {
          mainWindow.webContents.send('ssh-data', connectionId, data.toString('utf-8'));
        });
        
        stream.on('close', () => {
          mainWindow.webContents.send('ssh-closed', connectionId);
          sshConnections.delete(connectionId);
          conn.end();
        });
        
        stream.stderr.on('data', (data) => {
          mainWindow.webContents.send('ssh-data', connectionId, data.toString('utf-8'));
        });
        
        resolve({ success: true, connectionId });
      });
    });
    
    conn.on('error', (err) => {
      reject(err);
    });
    
    // Connect
    conn.connect(config);
  });
});

// Send data to SSH
ipcMain.handle('ssh-write', async (event, connectionId, data) => {
  const connection = sshConnections.get(connectionId);
  if (connection && connection.stream) {
    connection.stream.write(data);
    return true;
  }
  return false;
});

// Disconnect SSH
ipcMain.handle('ssh-disconnect', async (event, connectionId) => {
  const connection = sshConnections.get(connectionId);
  if (connection) {
    if (connection.stream) {
      connection.stream.end();
    }
    if (connection.client) {
      connection.client.end();
    }
    sshConnections.delete(connectionId);
  }
  return true;
});

// Resize terminal
ipcMain.handle('ssh-resize', async (event, connectionId, rows, cols) => {
  const connection = sshConnections.get(connectionId);
  if (connection && connection.stream && connection.stream.setWindow) {
    connection.stream.setWindow(rows, cols);
    return true;
  }
  return false;
});

// SCP - List directory contents
ipcMain.handle('scp-list-dir', async (event, connectionId, remotePath) => {
  return new Promise((resolve, reject) => {
    const connection = sshConnections.get(connectionId);
    if (!connection || !connection.client) {
      return reject(new Error('No active SSH connection'));
    }
    
    connection.client.sftp((err, sftp) => {
      if (err) return reject(err);
      
      sftp.readdir(remotePath, (err, list) => {
        if (err) return reject(err);
        
        const files = list.map(item => ({
          name: item.filename,
          type: item.longname.startsWith('d') ? 'directory' : 'file',
          size: item.attrs.size,
          permissions: item.longname.substring(0, 10),
          modified: new Date(item.attrs.mtime * 1000).toLocaleString()
        }));
        
        resolve(files);
      });
    });
  });
});

// SCP - Upload file
ipcMain.handle('scp-upload', async (event, connectionId, localPath, remotePath) => {
  return new Promise((resolve, reject) => {
    const connection = sshConnections.get(connectionId);
    if (!connection || !connection.client) {
      return reject(new Error('No active SSH connection'));
    }
    
    connection.client.sftp((err, sftp) => {
      if (err) return reject(err);
      
      const readStream = fs.createReadStream(localPath);
      const writeStream = sftp.createWriteStream(remotePath);
      
      let totalSize = 0;
      let uploadedSize = 0;
      
      // Get file size
      try {
        const stats = fs.statSync(localPath);
        totalSize = stats.size;
      } catch (e) {
        totalSize = 0;
      }
      
      readStream.on('data', (chunk) => {
        uploadedSize += chunk.length;
        const progress = totalSize > 0 ? Math.round((uploadedSize / totalSize) * 100) : 0;
        mainWindow.webContents.send('scp-progress', connectionId, 'upload', progress);
      });
      
      writeStream.on('close', () => {
        resolve({ success: true, remotePath });
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
      
      readStream.pipe(writeStream);
    });
  });
});

// SCP - Download file
ipcMain.handle('scp-download', async (event, connectionId, remotePath, localPath) => {
  return new Promise((resolve, reject) => {
    const connection = sshConnections.get(connectionId);
    if (!connection || !connection.client) {
      return reject(new Error('No active SSH connection'));
    }
    
    connection.client.sftp((err, sftp) => {
      if (err) return reject(err);
      
      // Get file size first
      sftp.stat(remotePath, (err, stats) => {
        if (err) return reject(err);
        
        const totalSize = stats.size;
        let downloadedSize = 0;
        
        const readStream = sftp.createReadStream(remotePath);
        const writeStream = fs.createWriteStream(localPath);
        
        readStream.on('data', (chunk) => {
          downloadedSize += chunk.length;
          const progress = totalSize > 0 ? Math.round((downloadedSize / totalSize) * 100) : 0;
          mainWindow.webContents.send('scp-progress', connectionId, 'download', progress);
        });
        
        writeStream.on('close', () => {
          resolve({ success: true, localPath });
        });
        
        writeStream.on('error', (err) => {
          reject(err);
        });
        
        readStream.on('error', (err) => {
          reject(err);
        });
        
        readStream.pipe(writeStream);
      });
    });
  });
});

// SCP - Delete file
ipcMain.handle('scp-delete', async (event, connectionId, remotePath, isDirectory) => {
  return new Promise((resolve, reject) => {
    const connection = sshConnections.get(connectionId);
    if (!connection || !connection.client) {
      return reject(new Error('No active SSH connection'));
    }
    
    connection.client.sftp((err, sftp) => {
      if (err) return reject(err);
      
      if (isDirectory) {
        sftp.rmdir(remotePath, (err) => {
          if (err) return reject(err);
          resolve({ success: true });
        });
      } else {
        sftp.unlink(remotePath, (err) => {
          if (err) return reject(err);
          resolve({ success: true });
        });
      }
    });
  });
});

// SCP - Create directory
ipcMain.handle('scp-mkdir', async (event, connectionId, remotePath) => {
  return new Promise((resolve, reject) => {
    const connection = sshConnections.get(connectionId);
    if (!connection || !connection.client) {
      return reject(new Error('No active SSH connection'));
    }
    
    connection.client.sftp((err, sftp) => {
      if (err) return reject(err);
      
      sftp.mkdir(remotePath, (err) => {
        if (err) return reject(err);
        resolve({ success: true });
      });
    });
  });
});

// Browse for local file to upload
ipcMain.handle('browse-local-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths;
  }
  return null;
});

// Browse for local directory to save download
ipcMain.handle('browse-save-location', async (defaultName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName
  });
  
  if (!result.canceled && result.filePath) {
    return result.filePath;
  }
  return null;
});

