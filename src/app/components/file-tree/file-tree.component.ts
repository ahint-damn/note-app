import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FileNode } from '../../utils/file.utils';
import * as feather from 'feather-icons';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { NavigationTab } from '../../interfaces/NavigationTab';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { ToastsService } from '../../services/toasts.service';
import { ContextMenuDirective } from '../../directives/context-menu.directive';
import { ContextMenuItem } from '../../interfaces/ContextMenu';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule, FormsModule, ContextMenuDirective],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
export class FileTreeComponent implements AfterViewInit, OnInit {
  @Input() fileNodes: FileNode[] = [];
  creatingFolder: boolean = false;
  creatingFile: boolean = false;
  
  constructor(
    private rtr: Router,
    private nav: NavigationService,
    private notes: NotesService,
    private toasts: ToastsService
  ) {
    this.notes.creatingFile$.subscribe((creatingFile) => {
      this.creatingFile = creatingFile;
    });
    this.notes.creatingFolder$.subscribe((creatingFolder) => {
      this.creatingFolder = creatingFolder;
    });
  }
  
  getContextMenu(node: FileNode): ContextMenuItem[] {
    if (node.createFolder || node.createFile) {
      return [];
    }

    if (node.extension) {
      const contextMenu: ContextMenuItem[] = [
        {
          label: 'Open',
          action: () => {
            this.clicked(node);
          },
        },
      ];
      return contextMenu;
    }

    const contextMenu: ContextMenuItem[] = [
      {
        label: 'Create Folder',
        action: () => {
          this.createFolderNode(node);
        },
      },
      {
        label: 'Create File',
        action: () => {
          this.createFileNode(node);
        },
      },
    ];
    return contextMenu;
  }
      


  ngAfterViewInit(): void {
    feather.replace();
  }

  ngOnInit(): void {}

  contextMenu(event: MouseEvent): void {
    console.log('EVENT', event);
  }

  createFileNode(targetNode: FileNode): void {
    if (this.notes.getCreatingFile()) {
      return;
    }

    if (this.notes.getCreatingFolder()) {
      this.notes.setCreatingFolder(false);
    }
    this.notes.setCreatingFile(true);
    
    if (targetNode.children && targetNode.children.filter((node) => node.createFile).length > 0) {
      return;
    }

    if (!targetNode.children) {
      targetNode.children = [];
    }
    const newNodePath = `${targetNode.path}/${targetNode.name}`;
    targetNode.children.push({
      name: '',
      children: [],
      isExpanded: false,
      icon: 'chevron-right',
      createFile: true,
    });
  }

  createFolderNode(targetNode: FileNode): void {
    if (this.notes.getCreatingFolder()) { 
      return;
    }
    if (this.notes.getCreatingFile()) {
      this.notes.setCreatingFile(false);
    }
    this.notes.setCreatingFolder(true);

    if (targetNode.children && targetNode.children.filter((node) => node.createFolder).length > 0) {
      return;
    }

    if (!targetNode.children) {
      targetNode.children = [];
    }
    const newNodePath = `${targetNode.path}/${targetNode.name}`;
    targetNode.children.push({
      name: '',
      children: [],
      isExpanded: false,
      icon: 'chevron-right',
      createFolder: true,
      path: newNodePath,
      parent: targetNode,
    });
  }

  getFullPath(node: FileNode): string {
    let path = node.name;
    let currentNode: FileNode | null = node;
    while (currentNode.parent) {
      currentNode = currentNode.parent;
      path = `${currentNode.name}/${path}`;
    }
    return path;
  }

  clicked(node: FileNode): void {
    if (!node.extension) {
      this.toggleNode(node);
    } else {
      const tab: NavigationTab = {
        Id: 0,
        title: node.name,
        noteId: node.id,
        path: 'note/' + node.id,
      };
      this.nav.addTab(tab);
    }
  }

  toggleNode(node: FileNode): void {
    node.isExpanded = !node.isExpanded;
    node.icon = node.isExpanded ? 'chevron-down' : 'chevron-right';
  }

  createFolder(node: FileNode) {
    const path = this.getFullPath(node);
    this.notes.createDirectoryByPath(path);
    this.notes.resetFileTree();
    console.log(`Creating folder at ${path}`);
  }

  createFile(node: FileNode) {
    const path = `${this.getFullPath(node)}.txt`;
    this.notes.saveNoteByPath(path, '');
    this.notes.resetFileTree();
    this.toasts.show({
      title: 'Success',
      duration: 3,
      type: 'success',
      message: 'File created',
    });
  }

  cancelFileEdit(node: FileNode) {
    this.notes.setCreatingFile(false);
    node.createFile = false;
    this.notes.resetFileTree();
  }

  cancelFolderEdit(node: FileNode) {
    this.notes.setCreatingFolder(false);
    node.createFolder = false;
    this.notes.resetFileTree();
  }
}
