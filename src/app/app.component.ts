import { AfterViewChecked, AfterViewInit, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
import { NavigationTab } from './interfaces/NavigationTab';
import { NavigationService } from './services/navigation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, NoteComponent, SidebarComponent, 
    ResizableDirective, ToastAreaComponent, FileTreeComponent, CommonModule 
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'note-app';
  tabs: NavigationTab[] = [];
  activeTabId: number = 0;
  
  constructor(private router: Router, private notesService: NotesService, private toastsService: ToastsService, private nav: NavigationService) {
    this.nav.getTabs().subscribe(tabs => {
      this.tabs = tabs;
    });

    this.nav.getActiveTabId().subscribe(activeTabId => {
      this.activeTabId = activeTabId;
      this.router.navigate([this.tabs[this.activeTabId].path]);
    });
  }

  closeTab(id: number){
    this.nav.closeTab(id);
  }

  ngAfterViewInit(): void {
    feather.replace();
  }

  openTab(id:number){
    this.nav.setActiveTabId(id);
    this.router.navigate([this.tabs[id].path]);
  }

  ngOnInit() {
    if (this.notesService.checkIfElectron()) {
      this.toastsService.show({title:'Development', duration:3, type: 'success', message: 'Running in Electron'});
      this.notesService.getFiles();
    }
    else{
      this.toastsService.show({title:'Development', duration:3, type: 'success', message: 'Running in Browser'});
    }
    this.openTab(this.activeTabId);
  }
}
