// Load xterm modules
const { Terminal } = require('@xterm/xterm');
const { FitAddon } = require('@xterm/addon-fit');
const { WebLinksAddon } = require('@xterm/addon-web-links');

// Global variables
let connections = [];
let currentConnection = null;
let terminal = null;
let fitAddon = null;
let activeSessionId = null;
let allFiles = []; // Store for file search
let commandSnippets = [
  { name: 'List All', cmd: 'ls -la' },
  { name: 'Disk Space', cmd: 'df -h' },
  { name: 'Memory', cmd: 'free -h' },
  { name: 'Top', cmd: 'top' },
  { name: 'Processes', cmd: 'ps aux' }
];

// DOM elements
const connectionsList = document.getElementById('connectionsList');
const welcomeScreen = document.getElementById('welcomeScreen');
const terminalContainer = document.getElementById('terminalContainer');
const connectionModal = document.getElementById('connectionModal');
const connectionForm = document.getElementById('connectionForm');
const currentConnectionName = document.getElementById('currentConnectionName');
const connectionStatus = document.getElementById('connectionStatus');

// Buttons
const btnNewConnection = document.getElementById('btnNewConnection');
const btnNewConnectionWelcome = document.getElementById('btnNewConnectionWelcome');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCancel = document.getElementById('btnCancel');
const btnDisconnect = document.getElementById('btnDisconnect');
const btnBrowseKey = document.getElementById('btnBrowseKey');

// New elements
const searchConnections = document.getElementById('searchConnections');
const activeConnectionBar = document.getElementById('activeConnectionBar');
const activeConnectionName = document.getElementById('activeConnectionName');
const btnQuickSwitch = document.getElementById('btnQuickSwitch');
const quickSwitchModal = document.getElementById('quickSwitchModal');
const btnCloseQuickSwitch = document.getElementById('btnCloseQuickSwitch');
const quickSwitchSearch = document.getElementById('quickSwitchSearch');
const quickSwitchList = document.getElementById('quickSwitchList');
const searchFiles = document.getElementById('searchFiles');
const btnAddSnippet = document.getElementById('btnAddSnippet');
const notificationsContainer = document.getElementById('notificationsContainer');

// File Manager elements
const btnTabTerminal = document.getElementById('btnTabTerminal');
const btnTabFiles = document.getElementById('btnTabFiles');
const terminalTab = document.getElementById('terminalTab');
const fileManagerTab = document.getElementById('fileManagerTab');
const currentPath = document.getElementById('currentPath');
const btnGoBack = document.getElementById('btnGoBack');
const btnGoPath = document.getElementById('btnGoPath');
const btnRefreshFiles = document.getElementById('btnRefreshFiles');
const btnUploadFile = document.getElementById('btnUploadFile');
const btnNewFolder = document.getElementById('btnNewFolder');
const dropZone = document.getElementById('dropZone');
const fileList = document.getElementById('fileList');
const uploadProgress = document.getElementById('uploadProgress');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const progressBarFill = document.getElementById('progressBarFill');

// Form inputs
const inputConnectionName = document.getElementById('connectionName');
const inputHost = document.getElementById('host');
const inputPort = document.getElementById('port');
const inputUsername = document.getElementById('username');
const inputPassword = document.getElementById('password');
const inputKeyPath = document.getElementById('keyPath');
const inputPassphrase = document.getElementById('passphrase');
const authTypeRadios = document.querySelectorAll('input[name="authType"]');
const passwordAuth = document.getElementById('passwordAuth');
const keyAuth = document.getElementById('keyAuth');

// Initialize app
async function init() {
  await loadConnections();
  setupEventListeners();
  initializeTerminal();
}

// Load saved connections
async function loadConnections() {
  connections = await window.electronAPI.getConnections();
  renderConnections();
}

// Render connections list
function renderConnections(filteredConnections = null) {
  const connsToRender = filteredConnections || connections;
  
  if (connsToRender.length === 0) {
    connectionsList.innerHTML = `
      <div class="empty-state">
        <p>${filteredConnections ? '🔍 No connections found' : 'No saved connections yet.<br>Create your first connection!'}</p>
      </div>
    `;
    return;
  }
  
  connectionsList.innerHTML = connsToRender.map(conn => `
    <div class="connection-item ${currentConnection && currentConnection.id === conn.id ? 'active' : ''}" data-id="${conn.id}">
      <h3>${conn.name}</h3>
      <p>${conn.username}@${conn.host}:${conn.port}</p>
      <p>Auth: ${conn.authType === 'password' ? '🔑 Password' : '🔐 SSH Key'}</p>
      <div class="connection-actions">
        <button class="btn-icon connect" data-id="${conn.id}">Connect</button>
        <button class="btn-icon edit" data-id="${conn.id}">Edit</button>
        <button class="btn-icon delete" data-id="${conn.id}">Delete</button>
      </div>
    </div>
  `).join('');
  
  // Add event listeners to connection items
  document.querySelectorAll('.connection-item .connect').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      connectToServer(btn.dataset.id);
    });
  });
  
  document.querySelectorAll('.connection-item .edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      editConnection(btn.dataset.id);
    });
  });
  
  document.querySelectorAll('.connection-item .delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteConnection(btn.dataset.id);
    });
  });
}

// Setup event listeners
function setupEventListeners() {
  btnNewConnection.addEventListener('click', () => openConnectionModal());
  btnNewConnectionWelcome.addEventListener('click', () => openConnectionModal());
  btnCloseModal.addEventListener('click', closeConnectionModal);
  btnCancel.addEventListener('click', closeConnectionModal);
  btnDisconnect.addEventListener('click', disconnect);
  btnBrowseKey.addEventListener('click', browseKeyFile);
  
  // File Manager tabs
  btnTabTerminal.addEventListener('click', () => switchTab('terminal'));
  btnTabFiles.addEventListener('click', () => switchTab('files'));
  
  // File Manager actions
  btnGoBack.addEventListener('click', goBackDirectory);
  btnGoPath.addEventListener('click', goToPath);
  btnRefreshFiles.addEventListener('click', refreshFileList);
  btnUploadFile.addEventListener('click', uploadFile);
  btnNewFolder.addEventListener('click', createNewFolder);
  
  // Allow editing path
  currentPath.addEventListener('dblclick', () => {
    currentPath.readOnly = false;
    currentPath.select();
  });
  
  currentPath.addEventListener('blur', () => {
    currentPath.readOnly = true;
  });
  
  currentPath.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      goToPath();
    }
  });
  
  // Search connections
  searchConnections.addEventListener('input', (e) => {
    filterConnections(e.target.value);
  });
  
  // Quick switch
  btnQuickSwitch.addEventListener('click', openQuickSwitch);
  btnCloseQuickSwitch.addEventListener('click', closeQuickSwitch);
  quickSwitchSearch.addEventListener('input', (e) => {
    filterQuickSwitch(e.target.value);
  });
  
  // Close quick switch on background click
  quickSwitchModal.addEventListener('click', (e) => {
    if (e.target === quickSwitchModal) {
      closeQuickSwitch();
    }
  });
  
  // File search
  searchFiles.addEventListener('input', (e) => {
    filterFiles(e.target.value);
  });
  
  // Command snippets
  document.querySelectorAll('.snippet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      executeSnippet(btn.dataset.cmd);
    });
  });
  
  btnAddSnippet.addEventListener('click', addCustomSnippet);
  
  // Drag & Drop
  setupDragAndDrop();
  
  connectionForm.addEventListener('submit', handleFormSubmit);
  
  // Auth type toggle
  authTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'password') {
        passwordAuth.classList.remove('hidden');
        keyAuth.classList.add('hidden');
      } else {
        passwordAuth.classList.add('hidden');
        keyAuth.classList.remove('hidden');
      }
    });
  });
  
  // Close modal on background click
  connectionModal.addEventListener('click', (e) => {
    if (e.target === connectionModal) {
      closeConnectionModal();
    }
  });
  
  // SSH event listeners
  window.electronAPI.onSshData((connectionId, data) => {
    if (connectionId === activeSessionId && terminal) {
      terminal.write(data);
    }
  });
  
  window.electronAPI.onSshClosed((connectionId) => {
    if (connectionId === activeSessionId) {
      showWelcomeScreen();
      alert('SSH connection closed');
    }
  });
  
  // SCP progress listener
  window.electronAPI.onScpProgress((connectionId, type, progress) => {
    if (connectionId === activeSessionId) {
      showProgress(type, progress);
    }
  });
}

// Initialize terminal
function initializeTerminal() {
  terminal = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    theme: {
      background: '#000000',
      foreground: '#ffffff',
      cursor: '#ffffff',
      selection: 'rgba(255, 255, 255, 0.3)',
      black: '#000000',
      red: '#e06c75',
      green: '#98c379',
      yellow: '#d19a66',
      blue: '#61afef',
      magenta: '#c678dd',
      cyan: '#56b6c2',
      white: '#abb2bf',
      brightBlack: '#5c6370',
      brightRed: '#e06c75',
      brightGreen: '#98c379',
      brightYellow: '#d19a66',
      brightBlue: '#61afef',
      brightMagenta: '#c678dd',
      brightCyan: '#56b6c2',
      brightWhite: '#ffffff'
    }
  });
  
  fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.loadAddon(new WebLinksAddon());
  
  terminal.open(document.getElementById('terminal'));
  fitAddon.fit();
  
  // Handle terminal input
  terminal.onData((data) => {
    if (activeSessionId) {
      window.electronAPI.sshWrite(activeSessionId, data);
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (fitAddon) {
      fitAddon.fit();
      if (activeSessionId) {
        window.electronAPI.sshResize(
          activeSessionId,
          terminal.rows,
          terminal.cols
        );
      }
    }
  });
}

// Open connection modal
function openConnectionModal(connection = null) {
  connectionForm.reset();
  
  if (connection) {
    document.getElementById('modalTitle').textContent = 'Edit Connection';
    connectionForm.dataset.editId = connection.id;
    inputConnectionName.value = connection.name;
    inputHost.value = connection.host;
    inputPort.value = connection.port;
    inputUsername.value = connection.username;
    
    if (connection.authType === 'password') {
      document.querySelector('input[name="authType"][value="password"]').checked = true;
      inputPassword.value = connection.password || '';
      passwordAuth.classList.remove('hidden');
      keyAuth.classList.add('hidden');
    } else {
      document.querySelector('input[name="authType"][value="key"]').checked = true;
      inputKeyPath.value = connection.keyPath || '';
      inputPassphrase.value = connection.passphrase || '';
      passwordAuth.classList.add('hidden');
      keyAuth.classList.remove('hidden');
    }
  } else {
    document.getElementById('modalTitle').textContent = 'New Connection';
    delete connectionForm.dataset.editId;
    passwordAuth.classList.remove('hidden');
    keyAuth.classList.add('hidden');
  }
  
  connectionModal.classList.remove('hidden');
  inputConnectionName.focus();
}

// Close connection modal
function closeConnectionModal() {
  connectionModal.classList.add('hidden');
  connectionForm.reset();
}

// Handle form submit
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const authType = document.querySelector('input[name="authType"]:checked').value;
  
  const connection = {
    name: inputConnectionName.value,
    host: inputHost.value,
    port: parseInt(inputPort.value),
    username: inputUsername.value,
    authType: authType
  };
  
  if (authType === 'password') {
    connection.password = inputPassword.value;
  } else {
    connection.keyPath = inputKeyPath.value;
    connection.passphrase = inputPassphrase.value;
    
    if (!connection.keyPath) {
      alert('Please select an SSH key file');
      return;
    }
  }
  
  if (connectionForm.dataset.editId) {
    connection.id = connectionForm.dataset.editId;
  }
  
  try {
    await window.electronAPI.saveConnection(connection);
    await loadConnections();
    closeConnectionModal();
  } catch (err) {
    alert('Failed to save connection: ' + err.message);
  }
}

// Browse for key file
async function browseKeyFile() {
  const filePath = await window.electronAPI.browseKeyFile();
  if (filePath) {
    inputKeyPath.value = filePath;
  }
}

// Edit connection
function editConnection(id) {
  const connection = connections.find(c => c.id === id);
  if (connection) {
    openConnectionModal(connection);
  }
}

// Delete connection
async function deleteConnection(id) {
  const connection = connections.find(c => c.id === id);
  if (connection && confirm(`Delete connection "${connection.name}"?`)) {
    try {
      await window.electronAPI.deleteConnection(id);
      await loadConnections();
    } catch (err) {
      alert('Failed to delete connection: ' + err.message);
    }
  }
}

// Connect to server
async function connectToServer(id) {
  const connection = connections.find(c => c.id === id);
  if (!connection) return;
  
  // Show terminal
  showTerminalScreen(connection);
  
  // Clear terminal
  terminal.clear();
  terminal.write('Connecting to ' + connection.host + '...\r\n');
  
  try {
    activeSessionId = Date.now().toString();
    await window.electronAPI.sshConnect(activeSessionId, connection);
    
    connectionStatus.textContent = 'Connected';
    connectionStatus.classList.add('connected');
    
    // Show active connection bar
    activeConnectionBar.classList.remove('hidden');
    activeConnectionName.textContent = connection.name;
    
    // Set default path untuk file manager
    currentPath.value = '/home/' + connection.username;
    
    // Show notification
    showNotification('Connected', `Connected to ${connection.name}`, 'success');
    
    // Resize terminal to fit
    setTimeout(() => {
      fitAddon.fit();
      window.electronAPI.sshResize(
        activeSessionId,
        terminal.rows,
        terminal.cols
      );
    }, 100);
    
    terminal.focus();
  } catch (err) {
    terminal.write('\r\n\x1b[1;31mConnection failed: ' + err.message + '\x1b[0m\r\n');
    connectionStatus.textContent = 'Failed';
    connectionStatus.classList.remove('connected');
    activeSessionId = null;
    showNotification('Connection Failed', err.message, 'error');
  }
}

// Disconnect
async function disconnect() {
  if (activeSessionId) {
    await window.electronAPI.sshDisconnect(activeSessionId);
    activeSessionId = null;
  }
  
  // Hide active connection bar
  activeConnectionBar.classList.add('hidden');
  
  // Show notification
  showNotification('Disconnected', 'SSH connection closed', 'info');
  
  showWelcomeScreen();
}

// Show welcome screen
function showWelcomeScreen() {
  welcomeScreen.classList.remove('hidden');
  terminalContainer.classList.add('hidden');
}

// Show terminal screen
function showTerminalScreen(connection) {
  welcomeScreen.classList.add('hidden');
  terminalContainer.classList.remove('hidden');
  currentConnectionName.textContent = connection.name;
  currentConnection = connection;
}

// Switch tabs
function switchTab(tab) {
  if (tab === 'terminal') {
    btnTabTerminal.classList.add('active');
    btnTabFiles.classList.remove('active');
    terminalTab.classList.remove('hidden');
    fileManagerTab.classList.add('hidden');
  } else {
    btnTabTerminal.classList.remove('active');
    btnTabFiles.classList.add('active');
    terminalTab.classList.add('hidden');
    fileManagerTab.classList.remove('hidden');
    
    // Load files when switching to file manager
    if (activeSessionId) {
      refreshFileList();
    }
  }
}

// Go back one directory
function goBackDirectory() {
  const path = currentPath.value;
  if (path === '/' || path === '') return;
  
  const parts = path.split('/').filter(p => p);
  parts.pop();
  currentPath.value = '/' + parts.join('/') || '/';
  refreshFileList();
}

// Go to specific path
function goToPath() {
  currentPath.readOnly = true;
  refreshFileList();
}

// Drag & Drop setup
function setupDragAndDrop() {
  const fileManagerContent = document.getElementById('fileManagerContent');
  
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileManagerContent.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    fileManagerContent.addEventListener(eventName, () => {
      dropZone.classList.add('active');
    }, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    fileManagerContent.addEventListener(eventName, () => {
      dropZone.classList.remove('active');
    }, false);
  });
  
  fileManagerContent.addEventListener('drop', handleDrop, false);
}

// Handle dropped files
async function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = [...dt.files];
  
  if (!activeSessionId) {
    alert('Please connect to a server first');
    return;
  }
  
  for (const file of files) {
    await uploadFileToServer(file.path, file.name);
  }
}

// Refresh file list
async function refreshFileList() {
  if (!activeSessionId) return;
  
  const remotePath = currentPath.value || '/home';
  
  try {
    const files = await window.electronAPI.scpListDir(activeSessionId, remotePath);
    allFiles = files; // Store for search
    searchFiles.value = ''; // Clear search
    renderFileList(files, remotePath);
  } catch (err) {
    showNotification('Error', 'Failed to list directory: ' + err.message, 'error');
  }
}

// Render file list
function renderFileList(files, path) {
  if (files.length === 0) {
    fileList.innerHTML = `
      <div class="empty-file-list">
        <p style="font-size: 48px;">📂</p>
        <p>Empty directory</p>
      </div>
    `;
    return;
  }
  
  // Sort: directories first, then files
  files.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
  
  fileList.innerHTML = files.map(file => `
    <div class="file-item ${file.type}" data-name="${file.name}" data-type="${file.type}">
      <div class="file-icon">${file.type === 'directory' ? '📁' : '📄'}</div>
      <div class="file-info">
        <div class="file-name">${file.name}</div>
        <div class="file-details">
          ${file.type === 'directory' ? 'Folder' : formatFileSize(file.size)} • ${file.modified}
        </div>
      </div>
      <div class="file-actions">
        ${file.type === 'directory' ? 
          `<button class="btn-icon open-folder" data-name="${file.name}">Open</button>` :
          `<button class="btn-icon download-file" data-name="${file.name}">Download</button>`
        }
        <button class="btn-icon delete delete-item" data-name="${file.name}" data-type="${file.type}">Delete</button>
      </div>
    </div>
  `).join('');
  
  // Add event listeners
  document.querySelectorAll('.open-folder').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openFolder(btn.dataset.name);
    });
  });
  
  document.querySelectorAll('.download-file').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadFile(btn.dataset.name);
    });
  });
  
  document.querySelectorAll('.delete-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteItem(btn.dataset.name, btn.dataset.type === 'directory');
    });
  });
  
  // Double click to open folder or download file
  document.querySelectorAll('.file-item').forEach(item => {
    item.addEventListener('dblclick', () => {
      if (item.dataset.type === 'directory') {
        openFolder(item.dataset.name);
      } else {
        downloadFile(item.dataset.name);
      }
    });
  });
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Open folder
function openFolder(folderName) {
  let newPath = currentPath.value;
  
  if (folderName === '..') {
    // Go up one directory
    const parts = newPath.split('/').filter(p => p);
    parts.pop();
    newPath = '/' + parts.join('/');
  } else {
    // Go into folder
    newPath = newPath.endsWith('/') ? newPath + folderName : newPath + '/' + folderName;
  }
  
  currentPath.value = newPath || '/';
  refreshFileList();
}

// Upload file
async function uploadFile() {
  if (!activeSessionId) {
    alert('Please connect to a server first');
    return;
  }
  
  const filePaths = await window.electronAPI.browseLocalFile();
  if (!filePaths) return;
  
  for (const filePath of filePaths) {
    const fileName = require('path').basename(filePath);
    await uploadFileToServer(filePath, fileName);
  }
}

// Upload file to server
async function uploadFileToServer(localPath, fileName) {
  const remotePath = currentPath.value.endsWith('/') 
    ? currentPath.value + fileName 
    : currentPath.value + '/' + fileName;
  
  try {
    progressText.textContent = `Uploading ${fileName}...`;
    uploadProgress.classList.remove('hidden');
    
    await window.electronAPI.scpUpload(activeSessionId, localPath, remotePath);
    
    uploadProgress.classList.add('hidden');
    progressBarFill.style.width = '0%';
    
    showNotification('Upload Complete', `${fileName} uploaded successfully`, 'success');
    refreshFileList();
  } catch (err) {
    uploadProgress.classList.add('hidden');
    showNotification('Upload Failed', err.message, 'error');
  }
}

// Download file
async function downloadFile(fileName) {
  const remotePath = currentPath.value.endsWith('/') 
    ? currentPath.value + fileName 
    : currentPath.value + '/' + fileName;
  
  const localPath = await window.electronAPI.browseSaveLocation(fileName);
  if (!localPath) return;
  
  try {
    progressText.textContent = `Downloading ${fileName}...`;
    uploadProgress.classList.remove('hidden');
    
    await window.electronAPI.scpDownload(activeSessionId, remotePath, localPath);
    
    uploadProgress.classList.add('hidden');
    progressBarFill.style.width = '0%';
    
    showNotification('Download Complete', `${fileName} downloaded successfully`, 'success');
  } catch (err) {
    uploadProgress.classList.add('hidden');
    showNotification('Download Failed', err.message, 'error');
  }
}

// Delete item
async function deleteItem(name, isDirectory) {
  if (!confirm(`Delete ${isDirectory ? 'folder' : 'file'} "${name}"?`)) return;
  
  const remotePath = currentPath.value.endsWith('/') 
    ? currentPath.value + name 
    : currentPath.value + '/' + name;
  
  try {
    await window.electronAPI.scpDelete(activeSessionId, remotePath, isDirectory);
    alert(`Deleted ${name} successfully!`);
    refreshFileList();
  } catch (err) {
    alert('Delete failed: ' + err.message);
  }
}

// Create new folder
async function createNewFolder() {
  const folderName = prompt('Enter folder name:');
  if (!folderName) return;
  
  const remotePath = currentPath.value.endsWith('/') 
    ? currentPath.value + folderName 
    : currentPath.value + '/' + folderName;
  
  try {
    await window.electronAPI.scpMkdir(activeSessionId, remotePath);
    alert(`Created folder "${folderName}" successfully!`);
    refreshFileList();
  } catch (err) {
    alert('Create folder failed: ' + err.message);
  }
}

// Show progress
function showProgress(type, progress) {
  progressPercent.textContent = progress + '%';
  progressBarFill.style.width = progress + '%';
}

// Filter connections
function filterConnections(query) {
  if (!query) {
    renderConnections();
    return;
  }
  
  const filtered = connections.filter(conn => 
    conn.name.toLowerCase().includes(query.toLowerCase()) ||
    conn.host.toLowerCase().includes(query.toLowerCase()) ||
    conn.username.toLowerCase().includes(query.toLowerCase())
  );
  
  renderConnections(filtered);
}

// Quick Switch
function openQuickSwitch() {
  quickSwitchModal.classList.remove('hidden');
  quickSwitchSearch.value = '';
  renderQuickSwitchList();
  quickSwitchSearch.focus();
}

function closeQuickSwitch() {
  quickSwitchModal.classList.add('hidden');
}

function renderQuickSwitchList(filtered = null) {
  const conns = filtered || connections.filter(c => !currentConnection || c.id !== currentConnection.id);
  
  if (conns.length === 0) {
    quickSwitchList.innerHTML = '<p style="text-align:center;color:var(--text-secondary);">No other connections</p>';
    return;
  }
  
  quickSwitchList.innerHTML = conns.map(conn => `
    <div class="quick-switch-item" data-id="${conn.id}">
      <div style="flex:1">
        <div class="name">${conn.name}</div>
        <div class="details">${conn.username}@${conn.host}:${conn.port}</div>
      </div>
      <div>${conn.authType === 'password' ? '🔑' : '🔐'}</div>
    </div>
  `).join('');
  
  document.querySelectorAll('.quick-switch-item').forEach(item => {
    item.addEventListener('click', () => {
      closeQuickSwitch();
      switchConnection(item.dataset.id);
    });
  });
}

function filterQuickSwitch(query) {
  if (!query) {
    renderQuickSwitchList();
    return;
  }
  
  const filtered = connections.filter(conn => 
    (!currentConnection || conn.id !== currentConnection.id) &&
    (conn.name.toLowerCase().includes(query.toLowerCase()) ||
     conn.host.toLowerCase().includes(query.toLowerCase()) ||
     conn.username.toLowerCase().includes(query.toLowerCase()))
  );
  
  renderQuickSwitchList(filtered);
}

function switchConnection(id) {
  if (activeSessionId) {
    disconnect();
  }
  connectToServer(id);
}

// Notifications
function showNotification(title, message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };
  
  notification.innerHTML = `
    <div class="notification-icon">${icons[type]}</div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
    <button class="notification-close">&times;</button>
  `;
  
  notificationsContainer.appendChild(notification);
  
  // Close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Command Snippets
function executeSnippet(cmd) {
  if (!activeSessionId || !terminal) {
    showNotification('Error', 'Please connect to a server first', 'error');
    return;
  }
  
  terminal.write(cmd + '\r');
  window.electronAPI.sshWrite(activeSessionId, cmd + '\n');
  showNotification('Command Executed', cmd, 'info');
}

function addCustomSnippet() {
  const cmd = prompt('Enter command:');
  if (!cmd) return;
  
  const name = prompt('Enter snippet name:');
  if (!name) return;
  
  commandSnippets.push({ name, cmd });
  
  // Add button to snippets bar
  const snippetsBar = document.querySelector('.snippets-bar');
  const btn = document.createElement('button');
  btn.className = 'snippet-btn';
  btn.dataset.cmd = cmd;
  btn.textContent = `⚡ ${name}`;
  btn.addEventListener('click', () => executeSnippet(cmd));
  
  // Insert before "Add" button
  snippetsBar.insertBefore(btn, btnAddSnippet);
  
  showNotification('Snippet Added', `"${name}" has been added`, 'success');
}

// File Search
function filterFiles(query) {
  if (!query) {
    renderFileList(allFiles, currentPath.value);
    return;
  }
  
  const filtered = allFiles.filter(file =>
    file.name.toLowerCase().includes(query.toLowerCase())
  );
  
  renderFileList(filtered, currentPath.value);
}

// No overrides - functions are defined correctly below

// Initialize app when DOM is ready
init();

