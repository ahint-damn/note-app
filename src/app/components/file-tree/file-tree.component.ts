import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FileNode } from '../../utils/file.utils';
import * as feather from 'feather-icons';
import { Router } from '@angular/router';
import { debounce } from 'lodash';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss']
})
export class FileTreeComponent implements AfterViewInit, OnInit {
  @Input() fileNodes: FileNode[] = [];

  constructor(private rtr: Router) {
  }

  ngAfterViewInit(): void {
    feather.replace();
  }

  ngOnInit(): void {}

  clicked(node: FileNode): void {
    if (!node.extension) {
      this.toggleNode(node);
    } else {
      this.rtr.navigate(['/note', node.id]);
    }
  }

  toggleNode(node: FileNode): void {
    node.isExpanded = !node.isExpanded;
    node.icon = node.isExpanded ? 'chevron-down' : 'chevron-right';
  }
}
