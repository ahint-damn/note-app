import { Component } from '@angular/core';
import { ResizableDirective } from '../../directives/resizable.directive';
import { NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import { FileTreeComponent } from '../file-tree/file-tree.component';
import { FileNode, buildFileTree } from '../../utils/file.utils';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ResizableDirective, CommonModule, FileTreeComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  fileNodes: FileNode[] = [];

  constructor(private noteService: NotesService) {
    this.noteService.fileNodes$.subscribe((fileNodes) => {
      this.fileNodes = fileNodes;
    });
  }
}
