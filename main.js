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
console.log(`Notes directory: ${notesDir}`);

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
  console.log(`Notes directory sent to renderer: ${notesDir}`);
});

// Handle save-note event
ipcMain.on('save-note', (event, { filename, content }) => {
  const filePath = path.join(notesDir, filename + ".txt");
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Note saved to ${filePath}`);
});

// Handle read-note event
ipcMain.on('read-note', (event, filename) => {
  const filePath = path.join(notesDir, filename);
  const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : null;
  event.sender.send('read-note-response', content);
});
