import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { MarkdownModule } from 'ngx-markdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrimeNGConfig } from 'primeng/api';
import { SliderModule } from 'primeng/slider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(MarkdownModule.forRoot()),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(SliderModule),
  ]
};
