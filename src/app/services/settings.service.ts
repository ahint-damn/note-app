import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Settings } from '../interfaces/Settings';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  defaultSettings: Settings = {
    general: {autoUpdate: true, language: 'en', alwaysFocusNewFiles: true, backupNotes: false, backupToDrive: false},
    editor: {showLineNumbers: true, fontSize: 14, fontFamily: 'Arial', stats: true, autoSave: true},
    appearance: {theme: 'dark', UIFontSize: 18, UIFontFamily: 'Helvetica Neue', accentColor: '#ff5f5f'},
    notifications: {email: true, push: true, sms: true},
    privacy: {allowCookies: true, allowTracking: true, allowThirdParty: true},
    security: {twoFactor: true, encryption: false, usePassword: false}
  };

  private configSubject: BehaviorSubject<Settings> = new BehaviorSubject<Settings>(this.defaultSettings);

  config$: Observable<Settings> = this.configSubject.asObservable();

  constructor() { 
    if (this.isElectron()) {
      window.electron.onReloadConfig(() => {
        this.loadConfigJson();
      });
    }
  }

  getConfigJson = (): Observable<Settings> => {
    return this.config$;
  };

  public loadConfigJson = (): void => {
    if (this.isElectron()) {
      window.electron.getConfigJson().then((configJSON: string) => {
        this.configSubject.next(JSON.parse(configJSON));
      });
    }
  };

  private isElectron = (): boolean => {
    return !!(window && window.electron);
  };

  saveConfigJson(configJSON: string) {
    if (this.isElectron()) {
      window.electron.saveConfigJson(configJSON);
    }
  }
}
