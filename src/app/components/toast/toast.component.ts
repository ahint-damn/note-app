import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {
  @Input() toast?: any;
  @ViewChild('toastId') toastElement: any;
  constructor() {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.toastElement.nativeElement.classList.add('fade-out');
    }, 3000);
  }
}
