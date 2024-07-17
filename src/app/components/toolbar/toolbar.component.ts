import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  minimize() {
    (window as any).electron.windowControl('minimize');
  }

  close() {
    (window as any).electron.windowControl('close');
  }
}

