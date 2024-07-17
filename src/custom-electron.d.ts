interface ElectronAPI {
  windowControl(action: string): void;
  saveNote(filename: string, content: string): void;
  readNote(filename: string): Promise<string | null>;
  getNotesDir(): Promise<string | null>;
  getFiles(): Promise<string[]>;
}

interface Window {
  electron: ElectronAPI;
}
