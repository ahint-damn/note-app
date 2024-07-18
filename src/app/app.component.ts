import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ResizableDirective } from './directives/resizable.directive';
import { OnInit } from '@angular/core';
import { NotesService } from './services/notes.service';
import { ToastAreaComponent } from './components/toast-area/toast-area.component';
import { ToastsService } from './services/toasts.service';
import * as feather from 'feather-icons';
import { FileTreeComponent } from './components/file-tree/file-tree.component';
import { NoteComponent } from './pages/note/note.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, NoteComponent, SidebarComponent, ResizableDirective, ToastAreaComponent, FileTreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'note-app';

  constructor(private notesService: NotesService, private toastsService: ToastsService) {}


  ngAfterViewInit(): void {
      feather.replace();
  }
  ngOnInit() {
    if (this.notesService.checkIfElectron()) {
      this.toastsService.show({title:'Development', duration:3, type: 'success', message: 'Running in Electron'});
      this.notesService.getFiles();
    }
    else{
      this.toastsService.show({title:'Development', duration:3, type: 'success', message: 'Running in Browser'});
    }
  }
}
