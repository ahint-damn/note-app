interface ElectronAPI {
  windowControl(action: string): void;
  getNotesDir(): Promise<string | null>;
  getFiles(): Promise<string[]>;
  readNoteByPath(path: string): Promise<string | null>;
  saveNoteByPath(path: string, content: string): void;
  createDirectoryByPath(path: string): void;
}

interface Window {
  electron: ElectronAPI;
}
