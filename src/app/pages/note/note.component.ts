import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewChild, viewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
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
  @ViewChildren('lineDiv') lineDivs!: QueryList<ElementRef>;
  noteId: string = '';
  lines: Line[] = [];
  routeSub!: Subscription;
  wordCount: number = 0;
  charCount: number = 0;
  @ViewChild('stats') stats!: ElementRef;
  @ViewChild('noteArea') noteArea!: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute, private notesService: NotesService) {}


  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.noteId = params['id'];
      this.loadNote();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.centerStats();
  }

  updateStats(){
    this.getWordCount();
    this.getCharCount();
  }

  centerStats(){
    this.stats.nativeElement.style.width = this.noteArea.nativeElement.offsetWidth + 'px';
    this.updateStats();
  }

  ngAfterViewInit() {
    this.centerStats();
  }

  getWordCount() {
    this.wordCount = this.getCleanText().split(/\s+/).filter((word: string | any[]) => word.length > 0).length;
    return this.wordCount;
  }

  getCleanText(){
    var fullText = this.lines.map(line => line.raw).join(' ');
    fullText = fullText.replace(/(\*\*|__)(.*?)\1/g, '$2');
    fullText = fullText.replace(/(\*|_)(.*?)\1/g, '$2');
    fullText = fullText.replace(/(`{1,3})(.*?)\1/g, '$2');
    fullText = fullText.replace(/(\~\~)(.*?)\1/g, '$2');
    fullText = fullText.replace(/(\[.*?\])(\(.*?\))/g, '$1');
    fullText = fullText.replace(/(#{1,6})(.*?)(\n|$)/g, '$2');
    fullText = fullText.replace(/(\n)/g, ' ');
    return fullText;
  }

  getCharCount() {
    this.charCount = this.getCleanText().replace(/\s/g, '').length;
    return this.charCount;
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
    this.updateStats();
  }
  
  updateRawContent(event: any, index: number) {
    if (index >= 0 && index < this.lines.length) {
      this.lines[index].raw = event.target.innerText;
    }
   this.updateStats();
  }

  async updateLineContent(target: any, index: number) {
    if (index >= 0 && index < this.lines.length) {
      this.updateRawContent(target, index);
      if (this.lines[index].raw !== this.lines[index].rendered) {
        this.lines[index].rendered = this.syncMarkdownToHtml(this.lines[index].raw);
        this.saveNote();
      }
    }
  }

  selectLine(index: number) {
    if (index >= 0 && index < this.lines.length) {
      this.lines.forEach((line, i) => line.selected = (i === index));
    }
  }

  async insertLine(index: number, event: any) {
    event.preventDefault();
    const newLine: Line = { raw: '', rendered: '', selected: true };
    this.lines.splice(index + 1, 0, newLine);
    setTimeout(() => {
      this.selectLine(index + 1);
      if (this.lineDivs.length > index + 1) {
        setTimeout(() => {
          if (this.lineDivs.length > index + 1) {
            this.lineDivs.toArray()[index + 1].nativeElement.focus();
          }
        }, 0);
      }
    }, 0);
  }

  deleteLine(index: number) {
    if (this.lines.length > 1 && index >= 0 && index < this.lines.length) {
      this.lines.splice(index, 1);
      this.saveNote();
      setTimeout(() => {
        const focusIndex = Math.max(0, Math.min(index, this.lines.length - 1));
        this.selectLine(focusIndex);
        if (this.lineDivs.length > focusIndex) {
          this.lineDivs.toArray()[focusIndex].nativeElement.focus();
        }
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
    if (index >= 0 && index < this.lines.length) {
      switch (event.key) {
        case 'Enter':
          this.updateRawContent(event, index);
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
  }

  selectAll() {
    this.lines.forEach(line => line.selected = true);
    setTimeout(() => {
      if (this.lineDivs.length > 0) {
        const range = document.createRange();
        range.selectNodeContents(this.lineDivs.first.nativeElement);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }, 0);
  }
}
