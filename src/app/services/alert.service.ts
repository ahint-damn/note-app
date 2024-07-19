import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Alert } from '../interfaces/Alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<any>(null);
  private showAlertSubject = new BehaviorSubject<boolean>(false);
  
  private alert: Alert = {
    title: '',
    message: '',
    confirm: false,
    acceptText: 'OK',
    rejectText: 'Cancel',
    dismissText: 'OK',
  };

  getAlert(): Observable<any> {
    return this.alertSubject.asObservable();
  }

  setAlert(alert: Alert) {
    this.alert = alert;
    this.alertSubject.next(this.alert);
  }

  getShowAlert(): Observable<boolean> {
    return this.showAlertSubject.asObservable();
  }

  setShowAlert(showAlert: boolean) {
    this.showAlertSubject.next(showAlert);
  }

  show(alert: Alert) {
    this.setAlert(alert);
    this.setShowAlert(true);
  }

  constructor() { }
}