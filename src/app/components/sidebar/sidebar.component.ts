import { Component } from '@angular/core';
import { ResizableDirective } from '../../directives/resizable.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ResizableDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
