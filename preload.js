const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  windowControl: (action) => ipcRenderer.send('window-control', action),
  saveNote: (filename, content) => ipcRenderer.send('save-note', { filename, content }),
  readNote: (filename) => new Promise((resolve) => {
    ipcRenderer.once('read-note-response', (event, data) => resolve(data));
    ipcRenderer.send('read-note', filename);
  }),
  getNotesDir: () => new Promise((resolve) => {
    ipcRenderer.once('get-notes-dir-response', (event, data) => resolve(data));
    ipcRenderer.send('get-notes-dir');
  }),
  checkElectron: () => new Promise((resolve) => {
    ipcRenderer.once('check-electron-response', (event, data) => resolve(data));
    ipcRenderer.send('check-electron');
  })
});
