import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FileNode } from '../../utils/file.utils';
import * as feather from 'feather-icons';
import { Router } from '@angular/router';
import { debounce } from 'lodash';
import { NavigationService } from '../../services/navigation.service';
import { NavigationTab } from '../../interfaces/NavigationTab';
import { NoteComponent } from '../../pages/note/note.component';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
export class FileTreeComponent implements AfterViewInit, OnInit {
  @Input() fileNodes: FileNode[] = [];

  constructor(private rtr: Router, private nav: NavigationService, private notes: NotesService) {}

  ngAfterViewInit(): void {
    feather.replace();
  }

  ngOnInit(): void {}

  contextMenu(event: MouseEvent, node: FileNode): void {
    event.preventDefault();
    console.log(node);
    console.log(this.fileNodes);
    this.addNodeToTree(node);
  }

  addNodeToTree(targetNode: FileNode): void {
    if (!targetNode.children) {
      targetNode.children = [];
    }
    const newNodePath = `${targetNode.path}/${targetNode.name}`;
    targetNode.children.push({
      name: 'New Folder', // Ensuring a default name for new folders
      children: [],
      isExpanded: false,
      icon: 'chevron-right',
      createFolder: true,
      path: newNodePath, // Constructing the path correctly
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
    console.log(node);
    const path = this.getFullPath(node);
    console.log(path);
    this.notes.createDirectoryByPath(path);
    this.notes.getFiles();
  }

  createFile(node: FileNode) {
    const path = `${this.getFullPath(node)}.txt`;
    this.notes.saveNoteByPath(path, '');
    this.notes.getFiles();
  }

  cancelEdit(node: FileNode) {
    node.createFolder = false;
    node.createFile = false;
    this.notes.getFiles();
  }
}
