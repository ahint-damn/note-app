import { Component, OnInit } from '@angular/core';
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
  constructor() {}
  options: string[] = ['General', 'Appearance', 'Notifications', 'Privacy', 'Security', 'Help'];
  selectedOption: string = 'General';
  languages: any[] | undefined;
  themes: any[] | undefined;
  defaultSettings: Settings = {
    general: {autoUpdate: true, language: 'en'},
    editor: {alwaysFocusNewTabs: true, showLineNumbers: true, fontSize: 14, fontFamily: 'Arial', stats: true},
    appearance: {theme: 'dark', UIFontSize: 14, UIFontFamily: 'Arial', accentColor: '#ff5f5f'},
    notifications: {email: true, push: true, sms: true},
    privacy: {allowCookies: true, allowTracking: true, allowThirdParty: true},
    security: {twoFactor: true, encryption: true, password: 'password'}
  };
  settings!: Settings;

  ngOnInit() {
    this.settings = this.defaultSettings;
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
}