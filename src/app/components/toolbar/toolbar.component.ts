import { Component } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { NavigationTab } from '../../interfaces/NavigationTab';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { Router } from '@angular/router';
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [TooltipDirective],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  constructor(private nav: NavigationService, private router: Router) {}

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
    (window as any).electron.windowControl('minimize');
  }

  close() {
    (window as any).electron.windowControl('close');
  }

  maximize() {
    (window as any).electron.windowControl('maximize');
  }
}

