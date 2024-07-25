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
  private activeTabContent: string = '';
  private isElectron = (): boolean => {
    return !!(window && window.electron);
  };

  public getTabs(): Observable<NavigationTab[]> {
    return this.tabsSubject.asObservable();
  }

  public getActiveTabIdObservable(): Observable<number> {
    return this.activeTabIdSubject.asObservable();
  }

  public addTab(tab: NavigationTab) {
    const existingTab = this.tabs.find(t => t.path === tab.path);
    if (existingTab) {
      this.setActiveTabId(existingTab.Id);
      return;
    }
    tab.Id = this.tabs.length;
    this.tabs.push(tab);
    this.tabsSubject.next(this.tabs);
    this.setActiveTabId(tab.Id);
  }

  public setActiveTabId(id: number) {
    if (id >= 0 && id < this.tabs.length) {
      this.activeTabId = id;
      this.activeTabIdSubject.next(this.activeTabId);
    }
  }

  public closeTabByNoteId(noteId: string) {
    const tabIndex = this.tabs.findIndex(tab => tab.noteId === noteId);
    if (tabIndex >= 0) {
      this.closeTab(tabIndex);
    }
  }

  public closeTab(id: number) {
    const tabIndex = this.tabs.findIndex(tab => tab.Id === id);
    if (tabIndex >= 0) {
      this.tabs.splice(tabIndex, 1);
      this.tabs.forEach((tab, index) => (tab.Id = index));
      this.tabsSubject.next(this.tabs);
      if (this.tabs.length === 0) {
        this.addTab({ Id: 0, title: 'Welcome', path: 'welcome' });
        this.setActiveTabId(0);
      } else {
        if (this.activeTabId === id) {
          const newActiveTabId = tabIndex >= this.tabs.length ? this.tabs.length - 1 : tabIndex;
          this.setActiveTabId(newActiveTabId);
        } else if (this.activeTabId > id) {
          this.setActiveTabId(this.activeTabId - 1);
        }
      }
    }
  }

  public openInNewWindow(url: string): void {
    if (this.isElectron()) {
      window.electron.openInNewWindow(url);
    }
  }

  constructor() {
    this.addTab({ Id: 0, title: 'Welcome', path: 'welcome' });
  }
}