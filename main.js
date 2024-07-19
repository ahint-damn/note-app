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
      nodeIntegration: false, // Best practice to set nodeIntegration to false for security
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/dist/note-app/browser/index.html`);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
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

if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir);
}
console.log(`[i] notes directory: ${notesDir}`);

// Handle window control events
ipcMain.on('window-control', (event, arg) => {
  switch (arg) {
    case 'minimize':
      mainWindow.minimize();
      break;
    case 'close':
      mainWindow.close();
      break;
  }
});


//Get Note Directory
ipcMain.on('get-notes-dir', (event) => {
  event.sender.send('get-notes-dir-response', notesDir);
});


// Get Complete Directory, including subdirectories
ipcMain.on('get-files', (event) => {
  var files = fs.readdirSync(notesDir, { recursive: true });
  event.sender.send('get-files-response', files);
});

//read notes by path
ipcMain.on('read-note-by-path', (event, arg) => {
  const notePath = path.join(notesDir, arg);
  const note = fs.readFileSync(notePath, 'utf-8');
  event.sender.send('read-note-by-path-response', note);
});

//save notes by path
ipcMain.on('save-note-by-path', (event, arg) => {
  const notePath = path.join(notesDir, arg.path);
  fs.writeFileSync(notePath, arg.content);
  event.sender.send('save-note-by-path-response');
});

//create directory by path
ipcMain.on('create-directory-by-path', (event, arg) => {
  const directoryPath = path.join(notesDir, arg);
  //check if directory exists
  if (fs.existsSync(directoryPath)) {
    event.sender.send('create-directory-by-path-response', 'Directory already exists');
    return;
  }
  fs.mkdirSync(directoryPath);
  event.sender.send('create-directory-by-path-response');
});

//delete-node-by-path (file or directory)
ipcMain.on('delete-node-by-path', (event, arg) => {
  const nodePath = path.join(notesDir, arg);
  //check if node exists
  if (!fs.existsSync(nodePath
  )) {
    event.sender.send('delete-node-by-path-response', 'Node does not exist');
    return;
  }
  fs.rmSync(nodePath, { recursive: true });
  event.sender.send('delete-node-by-path-response');
});
