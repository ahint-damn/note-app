import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FileNode } from '../../utils/file.utils';
import * as feather from 'feather-icons';
import { Router } from '@angular/router';
import { debounce } from 'lodash';
import { NavigationService } from '../../services/navigation.service';
import { NavigationTab } from '../../interfaces/NavigationTab';
import { NoteComponent } from '../../pages/note/note.component';
@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
})
export class FileTreeComponent implements AfterViewInit, OnInit {
  @Input() fileNodes: FileNode[] = [];

  constructor(private rtr: Router, private nav: NavigationService) {}

  ngAfterViewInit(): void {
    feather.replace();
  }

  ngOnInit(): void {}

  clicked(node: FileNode): void {
    if (!node.extension) {
      this.toggleNode(node);
    } else {
      const tab: NavigationTab = {
        Id: 0,
        title: node.name,
        noteId: node.id,
        path: "note/" + node.id,
      }
      console.log('tab', tab);
      this.nav.addTab(tab);
    }
  }

  toggleNode(node: FileNode): void {
    node.isExpanded = !node.isExpanded;
    node.icon = node.isExpanded ? 'chevron-down' : 'chevron-right';
  }
}
