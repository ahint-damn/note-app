interface ElectronAPI {
  windowControl(action: string): void;
  saveNote(filename: string, content: string): void;
  readNote(filename: string): Promise<string | null>;
  getNotesDir(): Promise<string | null>;
}

interface Window {
  electron: ElectronAPI;
}
