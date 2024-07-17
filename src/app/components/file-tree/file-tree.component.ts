import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FileNode } from '../../utils/file.utils';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent {
  @Input() fileNodes: FileNode[] = [];
}

