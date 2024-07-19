import { Injectable } from '@angular/core';
import { buildFileTree, FileNode } from '../utils/file.utils';
import { BehaviorSubject } from 'rxjs';
import { ToastsService } from './toasts.service';
import { NavigationService } from './navigation.service';


@Injectable({
  providedIn: 'root'
})
export class NotesService {
  constructor(private toasts: ToastsService, private nav: NavigationService) {}

  //observable statuses
  private creatingFolderSubject = new BehaviorSubject<boolean>(false);
  creatingFolder$ = this.creatingFolderSubject.asObservable();
  private creatingFileSubject = new BehaviorSubject<boolean>(false);
  creatingFile$ = this.creatingFileSubject.asObservable();

  //observable file Nodes
  private fileNodes: FileNode[] = [];
  private fileNodesSubject = new BehaviorSubject<FileNode[]>([]);
  fileNodes$ = this.fileNodesSubject.asObservable();
  
  // Check if the app is running in Electron
  private isElectron = (): boolean => {
    return !!(window && window.electron);
  };

  //change status
  setCreatingFolder = (status: boolean): void => {
    this.creatingFolderSubject.next(status);
  };

  setCreatingFile = (status: boolean): void => {
    this.creatingFileSubject.next(status);
  };

  //get status
  getCreatingFolder = (): boolean => {
    return this.creatingFolderSubject.value;
  };

  getCreatingFile = (): boolean => {
    return this.creatingFileSubject.value;
  };

  checkIfElectron = (): boolean => {
    return this.isElectron();
  };

  getFileTree = (): FileNode[] => {
    if (this.fileNodes.length === 0) {
      this.resetFileTree();
    }
    return this.fileNodes;
  };

  resetFileTree(): Promise<string[]> {
    this.setCreatingFile(false);
    this.setCreatingFolder(false);
    return new Promise((resolve) => {
      if (this.isElectron()) {
        window.electron.resetFileTree().then(files => {
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
      try{
        window.electron.saveNoteByPath(path, content);
        // this.toasts.show({title: 'Success', duration: 3, type: 'success', message: 'File created'});
      }
      catch{
        this.toasts.show({title: 'Error', duration: 3, type: 'error', message: 'Error saving / creating file'});
      }

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

  //deleteNodeById
  deleteNodeById = (id: string): void => {
    const path = this.getNotePath(id);
    if (this.isElectron()) {
      window.electron.deleteNodeByPath(path);
      this.toasts.show({title: 'Success', duration: 3, type: 'success', message: 'Item Deleted'});
      this.nav.closeTabByNoteId(id);
    }
  }

  deleteNodeByPath = (path: string): void => {
    if (this.isElectron()) {
      window.electron.deleteNodeByPath(path);
    }
  }

}
