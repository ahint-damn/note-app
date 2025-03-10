const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/dist/note-app/browser/index.html`);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

accountWindowInstance = null;

function createAccountWindow(route, onCloseCallback) {
  console.log('createAccountWindow');
  if (accountWindowInstance) {
    accountWindowInstance.focus();
    return accountWindowInstance;
  }
  let accountWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    frame: false,
    backgroundColor: '#2a2a2b',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const accountWindowUrl = `file://${__dirname}/dist/note-app/browser/index.html#/account`;
  console.log(`[i] new window url: ${accountWindowUrl}`);
  accountWindow.loadURL(accountWindowUrl);
  accountWindowInstance = accountWindow;

  accountWindow.on('closed', function () {
    accountWindow = null;
    accountWindowInstance = null;
    if (typeof onCloseCallback === 'function') {
      onCloseCallback();
    }
  });

  return accountWindow;
}

settingsWindowInstance = null;

function createSettingsWindow(route, onCloseCallback) {
  if (settingsWindowInstance) {
    settingsWindowInstance.focus();
    return settingsWindowInstance;
  }
  let settingsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    frame: false,
    backgroundColor: '#2a2a2b',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const settingsWindowUrl = `file://${__dirname}/dist/note-app/browser/index.html#/settings`;
  console.log(`[i] new window url: ${settingsWindowUrl}`);
  settingsWindow.loadURL(settingsWindowUrl);
  settingsWindowInstance = settingsWindow;

  settingsWindow.on('closed', function () {
    settingsWindow = null;
    settingsWindowInstance = null;
    if (typeof onCloseCallback === 'function') {
      onCloseCallback();
    }
  });
  
  return settingsWindow;
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Directory for storing notes
const notesDir = path.join(app.getPath('documents'), 'Notes');

const configDir = path.join(app.getPath('userData'), 'notes-config');

if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir);
}
console.log(`[i] notes directory: ${notesDir}`);

// Handle window control events
ipcMain.on('window-control', (event, arg) => {
  console.log(`[i] window control: ${arg}`);
  switch (arg) {
    case 'minimize-settings':
      settingsWindowInstance.minimize();
      break;
    case 'maximize-settings':
      if (settingsWindowInstance.isMaximized()) {
        settingsWindowInstance.unmaximize();
      }
      else {
        settingsWindowInstance.maximize();
      }
      break;
    case 'close-settings':
      settingsWindowInstance.close();
      break;
    case 'minimize-account':
      accountWindowInstance.minimize();
      break;
    case 'maximize-account':
      if (accountWindowInstance.isMaximized()) {
        accountWindowInstance.unmaximize();
      }
      else {
        accountWindowInstance.maximize();
      }
      break;
    case 'close-account':
      accountWindowInstance.close();
      break;
    case 'minimize-main':
      mainWindow.minimize();
      break;
    case 'close-main':
      mainWindow.close();
      break;
    case 'maximize-main':
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      }
      else {
        mainWindow.maximize();
      }
      break;
    default:
      break;
  }
});

// Get Note Directory
ipcMain.on('get-notes-dir', (event) => {
  event.sender.send('get-notes-dir-response', notesDir);
});

// Get Complete Directory, including subdirectories
ipcMain.on('get-files', (event) => {
  var files = fs.readdirSync(notesDir, { recursive: true });
  event.sender.send('get-files-response', files);
});

// Read notes by path
ipcMain.on('read-note-by-path', (event, arg) => {
  try{
    const notePath = path.join(notesDir, arg);
    if (!fs.existsSync(notePath
    )) {
      console.log(`[i] note does not exist: ${notePath}`);
      event.sender.send('read-note-by-path-response', 'Note does not exist');
      return;
    }
    const note = fs.readFileSync(notePath, 'utf-8');
    console.log(`[i] note read: ${notePath}`);
    event.sender.send('read-note-by-path-response', note);
  }
  catch{
    console.log('Error reading note');
    event.sender.send('read-note-by-path-response', 'Error reading note');
    return;
  }
});

// Save notes by path
ipcMain.on('save-note-by-path', (event, arg) => {
  try{
    const notePath = path.join(notesDir, arg.path);
    fs.writeFileSync(notePath, arg.content);
    console.log(`[i] note saved: ${notePath}`);
  }
  catch{
    console.log('Error saving note');
    event.sender.send('save-note-by-path-response', 'Error saving note');
    return;
  }
  event.sender.send('save-note-by-path-response');
});

// Create directory by path
ipcMain.on('create-directory-by-path', (event, arg) => {
  const directoryPath = path.join(notesDir, arg);
  if (fs.existsSync(directoryPath)) {
    event.sender.send('create-directory-by-path-response', 'Directory already exists');
    return;
  }
  fs.mkdirSync(directoryPath);
  event.sender.send('create-directory-by-path-response');
});

// Delete node by path (file or directory)
ipcMain.on('delete-node-by-path', (event, arg) => {
  const nodePath = path.join(notesDir, arg);
  if (!fs.existsSync(nodePath)) {
    event.sender.send('delete-node-by-path-response', 'Node does not exist');
    return;
  }
  fs.rmSync(nodePath, { recursive: true });
  event.sender.send('delete-node-by-path-response');
});

ipcMain.on('open-in-new-window', (event, route) => {
  const onCloseCallback = () => {
    mainWindow.webContents.send('reload-config');
  };
  if (route === 'account') {
    createAccountWindow(route, onCloseCallback);
  }
  else if (route === 'settings') {
    createSettingsWindow(route, onCloseCallback);
  }
  event.sender.send('open-in-new-window-response');
});


// Save config (JSON STRING)
ipcMain.on('save-config', (event, config) => {
  const configPath = path.join(configDir, 'config.json');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
    console.log(`[i] config directory created: ${configDir}`);
  }
  fs.writeFileSync(configPath, config);
  console.log(`[i] config saved: ${config}`);
  event.sender.send('save-config-response');
});

//get config
ipcMain.on('get-config', (event) => {
  const configPath = path.join(configDir, 'config.json');
  if (!fs.existsSync(configPath)) {
    event.sender.send('get-config-response', null);
    return;
  }
  const config = fs.readFileSync(configPath, 'utf-8');
  console.log(`[i] config read: ${config}`);
  event.sender.send('get-config-response', config);
});
