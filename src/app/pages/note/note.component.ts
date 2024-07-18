import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import * as feather from 'feather-icons';
import { marked } from 'marked';

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
export class NoteComponent implements OnInit, OnDestroy, AfterViewInit {
  noteId: string = '';
  lines: Line[] = [];
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

  async loadNote() {
    const content = await this.notes.readNoteByPath(this.notes.getNotePath(this.noteId));
    this.lines = await Promise.all(content.split('\n').map(async line => ({
      raw: line,
      rendered: await this.convertMarkdownToHtml(line),
      selected: false
    })));
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
    const content = this.lines.map(line => line.raw).join('\n');
    this.notes.saveNoteByPath(this.notes.getNotePath(this.noteId), content);
  }

  async updateLineContent(event: any, index: number) {
    const rawContent = event.target.innerText;
    this.lines[index].raw = rawContent;
    this.lines[index].rendered = await this.convertMarkdownToHtml(rawContent);
    this.saveNote();
  }

  selectLine(index: number) {
    this.lines.forEach((line, i) => {
      line.selected = i === index;
    });
  }

  async convertMarkdownToHtml(markdown: string): Promise<string> {
    return marked(markdown);
  }
}
