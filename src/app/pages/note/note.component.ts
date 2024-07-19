import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { debounce } from 'lodash';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, MarkdownModule, FormsModule, InputTextareaModule],
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('lineDiv') lineDivs!: QueryList<ElementRef>;
  noteId: string = '';
  routeSub!: Subscription;
  wordCount: number = 0;
  charCount: number = 0;
  @ViewChild('stats') stats!: ElementRef;
  @ViewChild('noteArea') noteArea!: ElementRef;
  noteContent: string = '';

  constructor(private route: ActivatedRoute, private notesService: NotesService) {
    this.valueChanged = debounce(this.valueChanged.bind(this), 300); // Debounce for 300 milliseconds
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.noteId = params['id'];
      this.loadNote();
    });
  }

  valueChanged() {
    this.updateStats();
    this.saveNote();
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
    let fullText = this.noteContent;
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
    this.noteContent = content;
    this.updateStats();
  }

  saveNote() {
    console.log('Saving note');
    this.notesService.saveNoteByPath(this.notesService.getNotePath(this.noteId), this.noteContent);
  }
}