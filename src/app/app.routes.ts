import { Routes } from '@angular/router';
import { NoteComponent } from './pages/note/note.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AccountComponent } from './pages/account/account.component';
export const routes: Routes = [
    {path: 'note/:id', component: NoteComponent},
    {path: 'welcome', component: WelcomeComponent},
    {path: 'settings', component: SettingsComponent},
    {path: 'account', component: AccountComponent},
];
