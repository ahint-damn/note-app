import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent implements OnInit, OnDestroy {
  noteId: string = '';
  noteContent: string = '';
  routeSub!: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private notes: NotesService) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.noteId = params['id'];
      this.loadNote();
    });
  }

  loadNote() {
    this.notes.readNoteByPath(this.notes.getNotePath(this.noteId)).then(content => {
      this.noteContent = content;
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}