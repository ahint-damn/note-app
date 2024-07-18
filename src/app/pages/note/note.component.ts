import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, HostListener } from '@angular/core';
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

  deleteLine(index: number) {
    if (this.lines.length > 1) {
      this.lines.splice(index, 1);
      this.saveNote();
      setTimeout(() => {
        const focusIndex = Math.max(0, index - 1);
        this.selectLine(focusIndex);
        this.lineDivs.toArray()[focusIndex].nativeElement.focus();
      }, 0);
    }
  }

  saveNote() {
    const content = this.lines.map(line => line.raw).join('\n');
    this.notesService.saveNoteByPath(this.notesService.getNotePath(this.noteId), content);
  }

  syncMarkdownToHtml(markdown: string): string {
    const result = marked(markdown);
    return typeof result === 'string' ? result : '';
  }

  handleKeydown(event: KeyboardEvent, index: number) {
    switch (event.key) {
      case 'Enter':
        this.insertLine(index, event);
        break;
      case 'Backspace':
        if (this.lines[index].raw === '') {
          this.deleteLine(index);
        }
        break;
      case 'a':
        if (event.metaKey || event.ctrlKey) {
          this.selectAll();
          event.preventDefault();
        }
        break;
    }
  }

  selectAll() {
    this.lines.forEach(line => line.selected = true);
    setTimeout(() => {
      const range = document.createRange();
      range.selectNodeContents(this.lineDivs.first.nativeElement);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 0);
  }
}
