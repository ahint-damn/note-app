import { Routes } from '@angular/router';
import { NoteComponent } from './pages/note/note.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
export const routes: Routes = [
    {path: 'note/:id', component: NoteComponent},
    {path: 'welcome', component: WelcomeComponent},
];
