import { Component } from '@angular/core';

export interface NavigationTab {
  Id: number;
  title: string;
  path: string;
  noteId?: string;
}
