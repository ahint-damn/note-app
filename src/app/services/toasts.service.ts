import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../interfaces/Toast';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {
  private toastsSource = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSource.asObservable();

  constructor() {
  }

  getToasts() {
    return this.toasts$;
  }

  show(toast: Toast) {
    const currentToasts = this.toastsSource.value;
    this.toastsSource.next([...currentToasts, toast]);
    setTimeout(() => {
      this.remove(toast);
    }, 3000);
  }

  remove(toast: Toast) {
    const currentToasts = this.toastsSource.value.filter(t => t !== toast);
    this.toastsSource.next(currentToasts);
  }
}
