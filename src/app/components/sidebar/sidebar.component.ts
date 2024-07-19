import { Component } from '@angular/core';
import { ResizableDirective } from '../../directives/resizable.directive';
import { NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import { FileTreeComponent } from '../file-tree/file-tree.component';
import { FileNode, buildFileTree } from '../../utils/file.utils';
import { ContextMenuDirective } from '../../directives/context-menu.directive';
import { ContextMenuItem } from '../../interfaces/ContextMenu';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ResizableDirective, CommonModule, FileTreeComponent, ContextMenuDirective],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  fileNodes: FileNode[] = [];

  getContextMenu(): ContextMenuItem[] {
    return [
      {
        label: 'New Folder',
        action: () => {
          this.createFolder();
        },
      },
      {
        label: 'New File',
        action: () => {
          this.createFile();
        },
      },
    ];
  }

  minimise(){
    //TODO: Implement reset wihtout preservation
    this.noteService.resetFileTree();
  }

  createFolder() {
    if (this.noteService.getCreatingFolder()){ 
      return;
    }
    if (this.noteService.getCreatingFile()){
      this.noteService.setCreatingFile(false);
    }
    this.noteService.setCreatingFolder(true);
    if (this.fileNodes.filter((node) => node.createFolder).length === 0){
      this.fileNodes.push({name: '', children: [], isExpanded: false, icon: 'chevron-right', createFolder: true});
    }
  }

  createFile(){
    if (this.noteService.getCreatingFile()){
      return;
    }
    if (this.noteService.getCreatingFolder()){
      this.noteService.setCreatingFolder(false);
    }
    this.noteService.setCreatingFile(true);
    //if a node without createFile = true
    if (this.fileNodes.filter((node) => node.createFile).length === 0){
      this.fileNodes.push({name: '', children: [], isExpanded: false, icon: 'chevron-right', createFile: true});
    }
  }

  constructor(private noteService: NotesService) {
    this.noteService.fileNodes$.subscribe((fileNodes) => {
      this.fileNodes = fileNodes;
    });
  }
}
