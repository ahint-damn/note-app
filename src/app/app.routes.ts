import { Routes } from '@angular/router';
import { NoteComponent } from './pages/note/note.component';

export const routes: Routes = [
    {path: 'note/:id', component: NoteComponent},
];
