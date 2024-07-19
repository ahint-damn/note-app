import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EventEmitter } from '@angular/core';
import { Alert } from '../../interfaces/Alert';
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule,ButtonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  // @Input() title!: string;
  // @Input() message!: string;
  // @Input() confirm: boolean = false;
  // @Input() acceptText: string = 'OK';
  // @Input() rejectText: string = 'Cancel';
  // @Input() dismissText: string = 'OK';
  // @Input() showClose: boolean = true;

  @Input() alert: Alert = {
    title: '',
    message: '',
    confirm: false,
    acceptText: 'OK',
    rejectText: 'Cancel',
    dismissText: 'OK',
    showClose: true
  };

  @Output() confirmEvent = new EventEmitter();
  @Output() cancelEvent = new EventEmitter();


  cancel() {
    this.cancelEvent.emit();
  }

  accept() {
    this.confirmEvent.emit();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.alert.confirm) {
      this.accept();
    }
  }


}
