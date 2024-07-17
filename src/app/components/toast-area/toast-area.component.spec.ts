import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastAreaComponent } from './toast-area.component';

describe('ToastAreaComponent', () => {
  let component: ToastAreaComponent;
  let fixture: ComponentFixture<ToastAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
