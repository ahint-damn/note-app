import { Component, OnInit } from '@angular/core';
import { ResizableDirective } from '../../directives/resizable.directive';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { Settings } from '../../interfaces/Settings';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ResizableDirective, CommonModule,
     InputSwitchModule, ButtonModule, FormsModule
    , DropdownModule, ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  constructor() {}
  options: string[] = ['General', 'Appearance', 'Notifications', 'Privacy', 'Security', 'Help'];
  selectedOption: string = 'General';
  languages: any[] | undefined;
  defaultSettings: Settings = {
    general: { autoUpdate: true, language: 'en' },
    appearance: [],
    notifications: [],
    privacy: [],
    security: []
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
  }

  toggle(option: string) {
    this.selectedOption = option;
  }
}