import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import * as feather from 'feather-icons';
import { marked, MarkedOptions } from 'marked';

interface Line {
  raw: string;
  rendered: string;
  selected: boolean;
}

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, MarkdownModule, FormsModule],
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit, OnDestroy {
  @ViewChildren('lineDiv') lineDivs!: QueryList<ElementRef>;
  noteId: string = '';
  lines: Line[] = [];
  routeSub!: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private notesService: NotesService) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.noteId = params['id'];
      this.loadNote();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  async loadNote() {
    const content = await this.notesService.readNoteByPath(this.notesService.getNotePath(this.noteId));
    this.lines = content.split('\n').map(line => ({
      raw: line,
      rendered: this.syncMarkdownToHtml(line),
      selected: false
    }));
  }

  updateRawContent(event: any, index: number) {
    this.lines[index].raw = event.target.innerText;
  }

  async updateLineContent(index: number) {
    if (this.lines[index].raw !== this.lines[index].rendered) {
      this.lines[index].rendered = this.syncMarkdownToHtml(this.lines[index].raw);
      this.saveNote();
    }
  }

  selectLine(index: number) {
    this.lines.forEach((line, i) => line.selected = (i === index));
  }

  async insertLine(index: number, event: any) {
    event.preventDefault();
    const newLine: Line = { raw: '', rendered: '', selected: true };
    this.lines.splice(index + 1, 0, newLine);
    setTimeout(() => {
      this.selectLine(index + 1);
      this.lineDivs.toArray()[index + 1].nativeElement.focus();
    }, 0);
  }

  saveNote() {
    const content = this.lines.map(line => line.raw).join('\n');
    this.notesService.saveNoteByPath(this.notesService.getNotePath(this.noteId), content);
  }

  // Ensure synchronous operation
  syncMarkdownToHtml(markdown: string): string {
    const result = marked(markdown);
    return typeof result === 'string' ? result : '';
  }
}
