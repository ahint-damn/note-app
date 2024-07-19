import { Component, Input, OnInit } from '@angular/core';
import { ContextMenuItem } from '../../interfaces/ContextMenu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  @Input() items: ContextMenuItem[] = [];

  onItemClicked(item: ContextMenuItem): void {
    if (item.args !== undefined) {
      item.action(item.args);
    } else {
      item.action();
    }
  }

  constructor() {}

  ngOnInit(): void {
    for (const item of this.items) {
      console.log('CONTEXT MENU LOADED');
    }
  }
}