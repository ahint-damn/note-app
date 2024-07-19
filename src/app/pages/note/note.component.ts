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
import { Settings } from '../../interfaces/Settings';
import { SettingsService } from '../../services/settings.service';
@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, MarkdownModule, FormsModule, InputTextareaModule],
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit, OnDestroy, AfterViewInit {
  noteId: string = '';
  routeSub!: Subscription;
  wordCount: number = 0;
  charCount: number = 0;
  @ViewChild('stats') stats!: ElementRef;
  @ViewChild('noteArea') noteArea!: ElementRef;
  @ViewChild('textArea') textArea!: ElementRef;
  noteContent: string = '';
  currentConfig!: Settings;

  constructor(private route: ActivatedRoute, private notesService: NotesService,
    private settings: SettingsService) {
    this.valueChanged = debounce(this.valueChanged.bind(this), 300); // Debounce for 300 milliseconds
    settings.config$.subscribe((config: Settings) => {
      this.currentConfig = config;
      this.updateStyling();
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.noteId = params['id'];
      this.loadNote();
    });
    this.updateStyling();
  }

  updateStyling(){
    if (!this.textArea) return;
    this.textArea.nativeElement.style.fontSize = this.currentConfig.editor.fontSize + 'px';
    this.textArea.nativeElement.style.fontFamily = this.currentConfig.editor.fontFamily;
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
    if (!this.textArea) return;
    this.getWordCount();
    this.getCharCount();
  }

  centerStats(){
    this.stats.nativeElement.style.width = this.noteArea.nativeElement.offsetWidth + 'px';
    this.updateStats();
  }

  ngAfterViewInit() {
    this.centerStats();
    this.updateStats();
    this.updateStyling();
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
    this.updateStyling();
  }

  saveNote() {
    this.notesService.saveNoteByPath(this.notesService.getNotePath(this.noteId), this.noteContent);
  }
}