export interface Setting {
  name: string;
  value: any;
}

export interface Settings {
  general: GeneralSettings;
  appearance: Setting[];
  notifications: Setting[];
  privacy: Setting[];
  security: Setting[];
}

export interface GeneralSettings {
  autoUpdate: boolean;
  language: string;
}
