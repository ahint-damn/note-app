interface ElectronAPI {
  windowControl(action: string): void;
  getNotesDir(): Promise<string | null>;
  resetFileTree(): Promise<string[]>;
  readNoteByPath(path: string): Promise<string | null>;
  saveNoteByPath(path: string, content: string): void;
  createDirectoryByPath(path: string): void;
  deleteNodeByPath(path: string): Promise<void>;
  openInNewWindow(url: string): void;
  saveConfigJson(configJSON: string): void;
  getConfigJson(): Promise<string>;
}

interface Window {
  electron: ElectronAPI;
}
