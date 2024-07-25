import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewChild, HostListener, Input } from '@angular/core';
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
import * as feather from 'feather-icons';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { NavigationService } from '../../services/navigation.service';
import { ToastsService } from '../../services/toasts.service';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, MarkdownModule, FormsModule, InputTextareaModule,
  TooltipDirective],
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit, OnDestroy, AfterViewInit {
  noteId: string = '';
  routeSub!: Subscription;
  wordCount: number = 0;
  charCount: number = 0;
  @ViewChild('noteArea') noteArea!: ElementRef;
  @ViewChild('textArea') textArea!: ElementRef;
  noteContent: string = '';
  currentConfig!: Settings;
  mdMode: string = 'both';
  extension: string = '.txt';
  touched: boolean = false;

  constructor(
    private route: ActivatedRoute, private toastService: ToastsService,
    private notesService: NotesService, private settings: SettingsService, 
    private nav: NavigationService) {
    this.processSave = debounce(this.processSave.bind(this), 1000); // Debounce for a second.
    settings.config$.subscribe((config: Settings) => {
      this.currentConfig = config;
      this.updateStyling();
    });

    this.notesService.mdMode$.subscribe((mode: string) => {
      this.mdMode = mode;
      console.log(`Mode: ${this.mdMode}`);
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.noteId = params['id'];
      this.loadNote();
    });
    this.updateStyling();
  }

  setEditorMode(mode: string) {
    if (mode == this.mdMode){
      return;
    }
    this.notesService.setMdMode(mode);
  }
  updateStyling(){
    if (!this.textArea) return;
    this.textArea.nativeElement.style.fontSize = this.currentConfig.editor.fontSize + 'px';
    this.textArea.nativeElement.style.fontFamily = this.currentConfig.editor.fontFamily;
  }

  processSave(){
    this.updateStats();
    this.saveNote();
    this.touched = false;
  }

  valueChanged() {
    this.touched = true;
    if (this.currentConfig.editor.autoSave){
      this.processSave();
    }
  }

  @HostListener('keydown.meta.s', ['$event'])
  handleMetaS(event: KeyboardEvent) {
    event.preventDefault();
    if (this.currentConfig.editor.autoSave){
      this.toastService.show({
        type: 'info',
        message: 'Auto Save is enabled.'
      });
      return;
    }
    this.processSave();
    this.toastService.show({
      type: 'success',
      message: 'Note Saved'
    });
  }

  updateStats(){
    if (!this.textArea) return;
    this.getWordCount();
    this.getCharCount();
  }

  ngAfterViewInit() {
    this.updateStats();
    this.updateStyling();
    feather.replace();
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
    const path = this.notesService.getNotePath(this.noteId);
    this.extension = path.split('.').pop() || 'txt';
    const content = await this.notesService.readNoteByPath(path);
    this.noteContent = content;
    this.updateStats();
    this.updateStyling();
  }

  saveNote() {
    this.notesService.saveNoteByPath(this.notesService.getNotePath(this.noteId), this.noteContent);
  }
}

//TODO: BlockNote Editor Almost Works.