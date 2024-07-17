import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  constructor() {}

  // Check if the app is running in Electron
  private isElectron = (): boolean => {
    return !!(window && window.electron);
  };

  checkIfElectron = (): boolean => {
    return this.isElectron();
  };

  // Save a note
  saveNote = (filename: string, content: string): void => {
    if (this.isElectron()) {
      window.electron.saveNote(filename, content);
    }
  };

  // Read a note
  readNote = (filename: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      if (this.isElectron()) {
        window.electron.readNote(filename).then(content => {
          resolve(content);
        });
      } else {
        resolve(null);
      }
    });
  };

  //getNotesDir
  getNotesDir = (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      if (this.isElectron()) {
        window.electron.getNotesDir().then(dir => {
          resolve(dir);
        });
      } else {
        resolve(null);
      }
    });
  }
}
