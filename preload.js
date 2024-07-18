const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  windowControl: (action) => ipcRenderer.send('window-control', action),
  readNoteByPath: (path) => new Promise((resolve) => {
    ipcRenderer.once('read-note-by-path-response', (event, data) => resolve(data));
    ipcRenderer.send('read-note-by-path', path);
  }),

  saveNoteByPath: (path, content) => new Promise((resolve) => {
    ipcRenderer.once('save-note-by-path-response', () => resolve());
    ipcRenderer.send('save-note-by-path', { path, content });
  }),
  getNotesDir: () => new Promise((resolve) => {
    ipcRenderer.once('get-notes-dir-response', (event, data) => resolve(data));
    ipcRenderer.send('get-notes-dir');
  }),
  checkElectron: () => new Promise((resolve) => {
    ipcRenderer.once('check-electron-response', (event, data) => resolve(data));
    ipcRenderer.send('check-electron');
  }),
  resetFileTree: () => new Promise((resolve) => {
    ipcRenderer.once('get-files-response', (event, data) => resolve(data));
    ipcRenderer.send('get-files');
  }),
  createDirectoryByPath: (path) => new Promise((resolve) => {
    ipcRenderer.once('create-directory-by-path-response', () => resolve());
    ipcRenderer.send('create-directory-by-path', path);
  })
});
