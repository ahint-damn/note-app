import { Component, HostListener, OnInit } from '@angular/core';
import { ResizableDirective } from '../../directives/resizable.directive';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { Settings } from '../../interfaces/Settings';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { SettingsService } from '../../services/settings.service';
import { ToastsService } from '../../services/toasts.service';
import { Toast } from '../../interfaces/Toast';
import { NavigationService } from '../../services/navigation.service';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ResizableDirective, CommonModule,
     InputSwitchModule, ButtonModule, FormsModule
    , DropdownModule, InputNumberModule, InputTextModule,
    ColorPickerModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  options: string[] = ['General', 'Appearance', 'Notifications', 'Privacy', 'Security', 'Help'];
  selectedOption: string = 'General';
  languages: any[] | undefined;
  themes: any[] | undefined;

  settings!: Settings;

  savedToast: Toast = {
    duration: 3,
    type: 'success',
    title: 'Settings Saved',
    message: 'Your settings have been saved successfully'
  };

  settingsBeforeChanges: Settings | undefined;


  constructor(private settingsService: SettingsService, 
    private toast: ToastsService) {
    this.settingsService.config$.subscribe((settings: Settings) => {
      this.settings = settings;
    });
    this.settingsService.loadConfigJson();
    this.settingsBeforeChanges = this.settings;
   }


  ngOnInit() {
    this.languages = [
      { label: 'English', value: 'en' },
      { label: 'Spanish', value: 'es' },
      { label: 'French', value: 'fr' },
      { label: 'German', value: 'de' },
      { label: 'Italian', value: 'it' }
    ];

    this.themes = [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
      { label: 'Visual Studio Dark', value: 'vs-dark' },
      { label: 'Monokai', value: 'monokai' },
      { label: 'Solarized Light', value: 'solarized-light' }
    ];
  }

  toggle(option: string) {
    this.selectedOption = option;
  }

  reset() {
    this.settings = this.settingsBeforeChanges!;
  }

  save() {
    this.settingsService.saveConfigJson(JSON.stringify(this.settings));
    (window as any).electron.windowControl('close-popup');
  }

  cancel() {
    (window as any).electron.windowControl('close-popup');
  }

  close(){
    (window as any).electron.windowControl('close-popup');
  }
  
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cancel();
    }
    else if (event.key === 'Enter') {
      this.save();
    }
  }

  changePassword(){
  }
}