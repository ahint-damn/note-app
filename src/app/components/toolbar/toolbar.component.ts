import { Component, Input } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { NavigationTab } from '../../interfaces/NavigationTab';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../services/notes.service';
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [TooltipDirective, CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  @Input() title: string = 'Quotient';
  @Input() target: string = 'main';
  @Input() showOptions: boolean = true;
  constructor(private nav: NavigationService, private notes: NotesService, private router: Router) {}

  settingsTab: NavigationTab = {
    Id: 0,
    title: 'Settings',
    path: 'settings',
    icon: 'settings'
  };

  accountTab: NavigationTab = {
    Id: 0,
    title: 'Account',
    path: 'account',
    icon: 'user'
  };
    
  toggleTheme(){
  }
  goSettingsPage(){
    //TODO: Make Electron Proof
    this.nav.openInNewWindow('settings');
  }

  goAccountPage(){
    //TODO: Make Electron Proof
    this.nav.openInNewWindow('account');
  }
  minimize() {
    (window as any).electron.windowControl('minimize-' + this.target);
  }

  close() {
    (window as any).electron.windowControl('close-' + this.target);
  }

  maximize() {
    (window as any).electron.windowControl('maximize-' + this.target);
  }
}

