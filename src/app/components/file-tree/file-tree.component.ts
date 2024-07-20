import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FileNode, generatePersistentId } from '../../utils/file.utils';
import * as feather from 'feather-icons';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { NavigationTab } from '../../interfaces/NavigationTab';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { ToastsService } from '../../services/toasts.service';
import { ContextMenuDirective } from '../../directives/context-menu.directive';
import { ContextMenuItem } from '../../interfaces/ContextMenu';
import { AlertService } from '../../services/alert.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule, FormsModule, ContextMenuDirective, InputTextModule],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
export class FileTreeComponent implements AfterViewInit, OnInit {
  @Input() fileNodes: FileNode[] = [];
  creatingFolder: boolean = false;
  creatingFile: boolean = false;
  @ViewChild('folderInput') folderInput!: any;
  @ViewChild('fileInput') fileInput!: any;

  constructor(
    private rtr: Router,
    private nav: NavigationService,
    private notes: NotesService,
    private toasts: ToastsService,
    private alertService: AlertService
  ) {
    this.notes.creatingFile$.subscribe((creatingFile) => {
      this.creatingFile = creatingFile;
      if (creatingFile) {
        setTimeout(() => {
          this.fileInput.nativeElement.focus();
        }, 0);
      }
    });
    this.notes.creatingFolder$.subscribe((creatingFolder) => {
      this.creatingFolder = creatingFolder;
      if (creatingFolder) {
        setTimeout(() => {
          this.folderInput.nativeElement.focus();
        }, 0);
      }
    });
  }

  getContextMenu(node: FileNode): ContextMenuItem[] {
    if (node.createFolder || node.createFile) {
      return [];
    }

    const contextMenu: ContextMenuItem[] = [];

    if (node.extension) {
      contextMenu.push({
        label: 'Open',
        action: () => this.clicked(node),
      });
    } else {
      contextMenu.push(
        {
          label: 'Create File',
          action: () => this.createFileNode(node),
        },
        {
          label: 'Create Folder',
          action: () => this.createFolderNode(node),
        }
      );
    }

    contextMenu.push({
      label: 'Delete',
      action: () => {
        this.alertService.show({
          title: 'Delete Confirmation',
          message: `Are you sure you want to delete ${node.name}?`,
          confirm: true,
          acceptText: 'Yes',
          rejectText: 'No',
          dismissText: 'Cancel',
        });

        this.alertService.getAlert().subscribe((alert) => {
          if (alert.positiveResponse) {
            this.notes.deleteNodeById(node.id!);
            this.notes.resetFileTree();
          }
        });
      },
    });

    return contextMenu;
  }

  ngAfterViewInit(): void {
    feather.replace();
  }

  ngOnInit(): void {}

  createFileNode(targetNode: FileNode): void {
    if (this.notes.getCreatingFile()) return;
    if (this.notes.getCreatingFolder()) this.notes.setCreatingFolder(false);
    this.notes.setCreatingFile(true);

    if (targetNode.children && targetNode.children.some((node) => node.createFile)) return;

    if (!targetNode.children) targetNode.children = [];

    const newNodePath = `${targetNode.path}/${targetNode.name}.txt`;
    targetNode.children.push({
      name: '',
      children: [],
      isExpanded: false,
      icon: 'chevron-right',
      createFile: true,
      path: newNodePath,
      parent: targetNode,
      id: generatePersistentId(newNodePath),
    });
  }

  createFolderNode(targetNode: FileNode): void {
    if (this.notes.getCreatingFolder()) return;
    if (this.notes.getCreatingFile()) this.notes.setCreatingFile(false);
    this.notes.setCreatingFolder(true);

    if (targetNode.children && targetNode.children.some((node) => node.createFolder)) return;

    if (!targetNode.children) targetNode.children = [];

    const newNodePath = `${targetNode.path}/${targetNode.name}`;
    targetNode.children.push({
      name: '',
      children: [],
      isExpanded: false,
      icon: 'chevron-right',
      createFolder: true,
      path: newNodePath,
      parent: targetNode,
      id: generatePersistentId(newNodePath),
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
      console.log(`[i] Opening note ${node.id}`, tab);
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
    console.log(`[i] Creating folder at ${path}`);
  }

  createFile(node: FileNode) {
    const path = `${this.getFullPath(node)}.txt`;
    this.notes.saveNoteByPath(path, '');
    this.notes.resetFileTree();
    this.toasts.show({
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

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.creatingFile || this.creatingFolder) {
      if (
        !event.target.closest('.context-menu') &&
        !event.target.closest('.feather') &&
        event.target.type !== 'text'
      ) {
        console.log('[i] Clicked outside of context menu');
        this.notes.setCreatingFile(false);
        this.notes.setCreatingFolder(false);
        this.notes.resetFileTree();
      }
    }
  }
}