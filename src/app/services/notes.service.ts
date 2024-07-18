import { Injectable } from '@angular/core';
import { buildFileTree, FileNode } from '../utils/file.utils';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotesService {
  constructor() {}

  //observable file Nodes
  private fileNodes: FileNode[] = [];
  private fileNodesSubject = new BehaviorSubject<FileNode[]>([]);
  fileNodes$ = this.fileNodesSubject.asObservable();
  
  // Check if the app is running in Electron
  private isElectron = (): boolean => {
    return !!(window && window.electron);
  };

  checkIfElectron = (): boolean => {
    return this.isElectron();
  };

  getFileTree = (): FileNode[] => {
    if (this.fileNodes.length === 0) {
      this.getFiles();
    }
    return this.fileNodes;
  };

  getFiles(): Promise<string[]> {
    return new Promise((resolve) => {
      if (this.isElectron()) {
        window.electron.getFiles().then(files => {
          if (files) {
            const tree = buildFileTree(files);
            this.fileNodes = tree;
            this.fileNodesSubject.next(this.fileNodes);
            resolve(files);
          }
        });
      } else {
        resolve([]);
      }
    });
  }

  recursiveSearch = (node: FileNode, id: string): FileNode | null => {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = this.recursiveSearch(child, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  getNotePath = (id: string): string => {
    const fileNode = this.fileNodes.find(node => node.id === id) || this.fileNodes.map(node => this.recursiveSearch(node, id)).find(node => node !== null);
    
    if (fileNode) {
      return fileNode.path || '';
    }
    console.log(`[!] No file path found for ${id}`);
    return '';
  };

  readNoteByPath = (path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (this.isElectron()) {
        window.electron.readNoteByPath(path).then(content => {
          resolve(content || '');
        });
      } else {
        resolve('');
      }
    });
  };

  saveNoteByPath = (path: string, content: string): void => {
    if (this.isElectron()) {
      window.electron.saveNoteByPath(path, content);
    }
  };
  
  createDirectoryByPath = (path: string): void => {
    if (this.isElectron()) {
      window.electron.createDirectoryByPath(path);
    }
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
