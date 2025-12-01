const { ipcRenderer } = require('electron');

// Expose API to window object (since contextIsolation is false)
window.electronAPI = {
  // Connection management
  getConnections: () => ipcRenderer.invoke('get-connections'),
  saveConnection: (connection) => ipcRenderer.invoke('save-connection', connection),
  deleteConnection: (id) => ipcRenderer.invoke('delete-connection', id),
  browseKeyFile: () => ipcRenderer.invoke('browse-key-file'),
  
  // SSH operations
  sshConnect: (connectionId, connectionData) => ipcRenderer.invoke('ssh-connect', connectionId, connectionData),
  sshWrite: (connectionId, data) => ipcRenderer.invoke('ssh-write', connectionId, data),
  sshDisconnect: (connectionId) => ipcRenderer.invoke('ssh-disconnect', connectionId),
  sshResize: (connectionId, rows, cols) => ipcRenderer.invoke('ssh-resize', connectionId, rows, cols),
  
  // Event listeners
  onSshData: (callback) => {
    ipcRenderer.on('ssh-data', (event, connectionId, data) => callback(connectionId, data));
  },
  onSshClosed: (callback) => {
    ipcRenderer.on('ssh-closed', (event, connectionId) => callback(connectionId));
  },
  
  // SCP operations
  scpListDir: (connectionId, remotePath) => ipcRenderer.invoke('scp-list-dir', connectionId, remotePath),
  scpUpload: (connectionId, localPath, remotePath) => ipcRenderer.invoke('scp-upload', connectionId, localPath, remotePath),
  scpDownload: (connectionId, remotePath, localPath) => ipcRenderer.invoke('scp-download', connectionId, remotePath, localPath),
  scpDelete: (connectionId, remotePath, isDirectory) => ipcRenderer.invoke('scp-delete', connectionId, remotePath, isDirectory),
  scpMkdir: (connectionId, remotePath) => ipcRenderer.invoke('scp-mkdir', connectionId, remotePath),
  browseLocalFile: () => ipcRenderer.invoke('browse-local-file'),
  browseSaveLocation: (defaultName) => ipcRenderer.invoke('browse-save-location', defaultName),
  onScpProgress: (callback) => {
    ipcRenderer.on('scp-progress', (event, connectionId, type, progress) => callback(connectionId, type, progress));
  }
};

