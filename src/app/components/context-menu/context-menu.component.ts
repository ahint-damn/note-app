import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() itemClicked: EventEmitter<void> = new EventEmitter<void>();

  onItemClicked(item: ContextMenuItem): void {
    if (item.args !== undefined) {
      item.action(item.args);
    } else {
      item.action();
    }
    this.itemClicked.emit();
  }

  constructor() {}

  ngOnInit(): void {
  }
}