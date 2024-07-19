import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ResizableDirective } from './directives/resizable.directive';
import { NotesService } from './services/notes.service';
import { ToastAreaComponent } from './components/toast-area/toast-area.component';
import { ToastsService } from './services/toasts.service';
import * as feather from 'feather-icons';
import { FileTreeComponent } from './components/file-tree/file-tree.component';
import { NoteComponent } from './pages/note/note.component';
import { NavigationTab } from './interfaces/NavigationTab';
import { NavigationService } from './services/navigation.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './components/alert/alert.component';
import { Alert } from './interfaces/Alert';
import { AlertService } from './services/alert.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, NoteComponent, SidebarComponent, 
    ResizableDirective, ToastAreaComponent, FileTreeComponent, CommonModule, 
    AlertComponent
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'note-app';
  tabs: NavigationTab[] = [];
  activeTabId: number = 0;
  alertFromService: Alert = {
    title: '',
    message: '',
    confirm: false,
    acceptText: 'OK',
    rejectText: 'Cancel',
    dismissText: 'OK',
    showClose: true
  };
  showAlert: boolean = false;
  
  constructor(
    private router: Router, 
    private alertService: AlertService, 
    private notesService: NotesService, 
    private toastsService: ToastsService, 
    private nav: NavigationService
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd){
        console.log(val);
        if (val.url.includes('settings') || val.url.includes('account')){
          this.isPopup = true;
        }
        else{
          this.loadMainWindow();
          this.isPopup = false;
        }
      }
    });
  }

  loadMainWindow(){
    this.nav.getTabs().subscribe(tabs => {
      this.tabs = tabs;
    });

    this.nav.getActiveTabId().subscribe(activeTabId => {
      this.activeTabId = activeTabId;
      if (this.tabs[this.activeTabId] !== undefined){
        this.router.navigate([this.tabs[this.activeTabId].path]);
      }
    });

    this.alertService.getAlert().subscribe(alert => {
      this.alertFromService = alert;
    });

    this.alertService.getShowAlert().subscribe(showAlert => {
      this.showAlert = showAlert;
    });
  }

  isPopup: boolean = false;

  alertConfirmed(){
    this.alertFromService.positiveResponse = true;
    this.alertService.setAlert(this.alertFromService);
    console.log(this.alertFromService);
    this.alertService.setShowAlert(false);
  }

  alertCancelled(){
    this.alertFromService.negativeResponse = true;
    this.alertService.setAlert(this.alertFromService);
    console.log(this.alertFromService);
    this.alertService.setShowAlert(false);
  }

  closeTab(id: number){
    this.nav.closeTab(id);
  }

  ngAfterViewInit(): void {
    feather.replace();
  }

  openTab(id:number){
    this.nav.setActiveTabId(id);
    if (this.tabs[id] === undefined){
      return;
    }
    this.router.navigate([this.tabs[id].path]);
  }

  ngOnInit() {
    if (this.notesService.checkIfElectron()) {
      this.toastsService.show({duration:3, type: 'info', message: 'Electron'});
      this.notesService.resetFileTree();
    }
    else{
      this.toastsService.show({duration:3, type: 'info', message: 'Browser'});
    }
    this.openTab(this.activeTabId);
  }
}