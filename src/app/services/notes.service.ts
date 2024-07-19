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

  // Observable statuses
  private creatingFolderSubject = new BehaviorSubject<boolean>(false);
  creatingFolder$ = this.creatingFolderSubject.asObservable();
  private creatingFileSubject = new BehaviorSubject<boolean>(false);
  creatingFile$ = this.creatingFileSubject.asObservable();

  // Observable file Nodes
  private fileNodesSubject = new BehaviorSubject<FileNode[]>([]);
  fileNodes$ = this.fileNodesSubject.asObservable();

  // Check if the app is running in Electron
  private isElectron = (): boolean => {
    return !!(window && window.electron);
  };

  // Change status
  setCreatingFolder(status: boolean): void {
    this.creatingFolderSubject.next(status);
  }

  setCreatingFile(status: boolean): void {
    this.creatingFileSubject.next(status);
  }

  // Get status
  getCreatingFolder(): boolean {
    return this.creatingFolderSubject.value;
  }

  getCreatingFile(): boolean {
    return this.creatingFileSubject.value;
  }

  checkIfElectron(): boolean {
    return this.isElectron();
  }

  // Get file tree
  getFileTree(): FileNode[] {
    if (this.fileNodesSubject.value.length === 0) {
      this.resetFileTree();
    }
    return this.fileNodesSubject.value;
  }

  resetFileTree(): Promise<string[]> {
    const expandedState = this.getExpandedState(this.fileNodesSubject.value);
    this.setCreatingFile(false);
    this.setCreatingFolder(false);
    return new Promise((resolve) => {
      if (this.isElectron()) {
        window.electron.resetFileTree().then(files => {
          if (files) {
            const tree = buildFileTree(files);
            this.restoreExpandedState(tree, expandedState);
            this.fileNodesSubject.next(tree);
            resolve(files);
          }
        });
      } else {
        resolve([]);
      }
    });
  }

  getNotePath(id: string): string {
    const findNodeById = (nodes: FileNode[], id: string): FileNode | null => {
      for (const node of nodes) {
        if (node.id === id) {
          return node;
        } else if (node.children) {
          const found = findNodeById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const fileNode = findNodeById(this.fileNodesSubject.value, id);
    if (fileNode) {
      return fileNode.path || '';
    }
    console.log(`[!] No file path found for ${id}`);
    return '';
  }

  readNoteByPath(path: string): Promise<string> {
    return new Promise((resolve) => {
      if (this.isElectron()) {
        window.electron.readNoteByPath(path).then(content => {
          resolve(content || '');
        });
      } else {
        resolve('');
      }
    });
  }

  saveNoteByPath(path: string, content: string): void {
    if (this.isElectron()) {
      try {
        console.log(`[i] Saving note at path: ${path}`);
        window.electron.saveNoteByPath(path, content);
      } catch {
        this.toasts.show({ title: 'Error', duration: 3, type: 'error', message: 'Error saving/creating file' });
      }
    }
  }

  createDirectoryByPath(path: string): void {
    if (this.isElectron()) {
      window.electron.createDirectoryByPath(path);
    }
  }

  getNotesDir(): Promise<string | null> {
    return new Promise((resolve) => {
      if (this.isElectron()) {
        window.electron.getNotesDir().then(dir => {
          resolve(dir);
        });
      } else {
        resolve(null);
      }
    });
  }

  deleteNodeById(id: string): void {
    const path = this.getNotePath(id);
    if (path && this.isElectron()) {
      console.log(`[i] Deleting node at path: ${path}`);
      this.closeTabsRecursively(id);
      window.electron.deleteNodeByPath(path).then(() => {
        this.toasts.show({ duration: 3, type: 'success', message: 'Item Deleted' });
        this.resetFileTree();
      });
    }
  }

  deleteNodeByPath(path: string): void {
    if (this.isElectron()) {
      console.log(`[i] Deleting node at path: ${path}`);
      window.electron.deleteNodeByPath(path).then(() => {
        this.resetFileTree();
      });
    }
  }

  private closeTabsRecursively(id: string): void {
    const findNodeById = (nodes: FileNode[], id: string): FileNode | null => {
      for (const node of nodes) {
        if (node.id === id) {
          return node;
        } else if (node.children) {
          const found = findNodeById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const findAllChildNodes = (node: FileNode): FileNode[] => {
      let nodes: FileNode[] = [];
      if (node.children) {
        node.children.forEach(child => {
          nodes.push(child);
          nodes = nodes.concat(findAllChildNodes(child));
        });
      }
      return nodes;
    };

    const rootNode = findNodeById(this.fileNodesSubject.value, id);
    if (rootNode) {
      const allChildNodes = findAllChildNodes(rootNode);
      allChildNodes.forEach(childNode => {
        this.nav.closeTabByNoteId(childNode.id!);
      });
      this.nav.closeTabByNoteId(id);
    }
  }

  private getExpandedState(nodes: FileNode[]): { [key: string]: boolean } {
    const expandedState: { [key: string]: boolean } = {};
    const traverseNodes = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (node.path) {
          expandedState[node.path] = node.isExpanded || false;
        }
        if (node.children) {
          traverseNodes(node.children);
        }
      });
    };
    traverseNodes(nodes);
    return expandedState;
  }  
  
  private restoreExpandedState(nodes: FileNode[], expandedState: { [key: string]: boolean }): void {
    const traverseNodes = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (node.path && expandedState[node.path] !== undefined) {
          node.isExpanded = expandedState[node.path];
          node.icon = node.isExpanded ? 'chevron-down' : 'chevron-right';
        } else {
        }
        if (node.children) {
          traverseNodes(node.children);
        }
      });
    };
    traverseNodes(nodes);
  }
}