import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import * as feather from 'feather-icons';
import { AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, MarkdownModule, FormsModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent implements OnInit, OnDestroy, AfterViewInit {
  noteId: string = '';
  noteContent: string = '';
  routeSub!: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private notes: NotesService) {}

  ngAfterViewInit(): void {
    feather.replace();
  }
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

  saveNote() {
    this.notes.saveNoteByPath(this.notes.getNotePath(this.noteId), this.noteContent);
  }
}