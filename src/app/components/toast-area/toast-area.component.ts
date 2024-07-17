import { Component, OnInit } from '@angular/core';
import { ToastComponent } from "../toast/toast.component";
import { ToastsService } from '../../services/toasts.service';
import { CommonModule } from '@angular/common';
import { Toast } from '../../interfaces/Toast';

@Component({
  selector: 'app-toast-area',
  standalone: true,
  imports: [ToastComponent, CommonModule],
  templateUrl: './toast-area.component.html',
  styleUrls: ['./toast-area.component.scss']
})
export class ToastAreaComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastsService) { }

  ngOnInit() {
    this.toastService.getToasts().subscribe({
      next: (toasts) => {
        this.toasts = toasts;
      }
    });
  }

  removeToast(toast: Toast) {
    this.toastService.remove(toast);
  }
}
