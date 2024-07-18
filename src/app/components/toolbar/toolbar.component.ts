import { Component } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { NavigationTab } from '../../interfaces/NavigationTab';
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  constructor(private nav: NavigationService) {}

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
    this.nav.addTab(this.settingsTab);
  }

  goAccountPage(){
    this.nav.addTab(this.accountTab);
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

