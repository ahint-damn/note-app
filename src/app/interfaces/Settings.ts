export interface Settings {
  general: GeneralSettings;
  editor: EditorSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
}

export interface GeneralSettings {
  autoUpdate: boolean;
  language: string;
  alwaysFocusNewFiles: boolean;
  backupNotes: boolean;
  backupToDrive: boolean;
}

export interface EditorSettings {
  showLineNumbers: boolean;
  fontSize: number;
  fontFamily: string;
  stats: boolean;
  autoSave: boolean;
}

export interface AppearanceSettings {
  theme: string;
  UIFontSize: number;
  UIFontFamily: string;
  accentColor: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface PrivacySettings {
  allowCookies: boolean;
  allowTracking: boolean;
  allowThirdParty: boolean;
}

export interface SecuritySettings {
  twoFactor: boolean;
  encryption: boolean;
  usePassword: boolean;
}

  
  