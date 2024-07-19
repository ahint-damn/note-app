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
}

export interface EditorSettings {
  alwaysFocusNewTabs: boolean;
  showLineNumbers: boolean;
  fontSize: number;
  fontFamily: string;
  stats: boolean;
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

  
  