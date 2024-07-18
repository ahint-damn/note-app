import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationTab } from '../interfaces/NavigationTab';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private tabs: NavigationTab[] = [];
  private tabsSubject: BehaviorSubject<NavigationTab[]> = new BehaviorSubject<NavigationTab[]>(this.tabs);
  private activeTabId: number = 0;
  private activeTabIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.activeTabId);

  public getTabs(): Observable<NavigationTab[]> {
    return this.tabsSubject.asObservable();
  }

  public getActiveTabId(): Observable<number> {
    return this.activeTabIdSubject.asObservable();
  }

  public addTab(tab: NavigationTab) {
    if (this.tabs.find(t => t.noteId === tab.noteId)) {
      this.setActiveTabId(this.tabs.findIndex(t => t.noteId === tab.noteId));
      return;
    }
    tab.Id = this.tabs.length;
    this.tabs.push(tab);
    this.tabsSubject.next(this.tabs);
    this.setActiveTabId(tab.Id);
  }

  public setActiveTabId(id: number) {
    this.activeTabId = id;
    this.activeTabIdSubject.next(this.activeTabId);
  }

  public closeTab(id: number) {
    this.tabs = this.tabs.filter(tab => tab.Id !== id);
    this.tabsSubject.next(this.tabs);
    if (this.activeTabId === id) {
      this.setActiveTabId(this.tabs.length - 1);
    }
    if (this.tabs.length === 0) {
      this.addTab({Id: 0, title: 'Welcome', path: 'welcome'});
      this.setActiveTabId(0);
    }
  }

  constructor() { 
    this.addTab({Id: 0, title: 'Welcome', path: 'welcome'});
  }
}
