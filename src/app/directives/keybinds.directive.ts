import { Directive, HostListener } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { NotesService } from '../services/notes.service';
import { NavigationService } from '../services/navigation.service';
import { ToastsService } from '../services/toasts.service';
import { Toast } from '../interfaces/Toast';

@Directive({
  selector: '[appKeybinds]',
  standalone: true,
})
export class KeybindsDirective {
  successfulSaveToast: Toast = {
    message: 'Note saved',
    type: 'success',
    title: 'Success',
  };
  constructor(
    private settingsService: SettingsService,
    private notesService: NotesService,
    private nav: NavigationService,
    private toasts: ToastsService
  ) {}
}
