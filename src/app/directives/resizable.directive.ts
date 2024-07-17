import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appResizable]',
  standalone: true
})
export class ResizableDirective {
  @Input('appResizable') resizableSide: string = 'right';

  private resizing: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private startWidth: number = 0;
  private startHeight: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    if (this.isInResizeZone(event, rect)) {
      this.resizing = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.startWidth = rect.width;
      this.startHeight = rect.height;
      event.preventDefault();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.resizing) {
      this.resize(event);
    } else {
      this.updateCursor(event);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.resizing = false;
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'default');
  }

  private isInResizeZone(event: MouseEvent, rect: DOMRect): boolean {
    const buffer = 10; // Buffer zone in pixels to consider as resize zone

    if (this.resizableSide === 'right') {
      return event.clientX > rect.right - buffer && event.clientX < rect.right + buffer;
    } else if (this.resizableSide === 'bottom') {
      return event.clientY > rect.bottom - buffer && event.clientY < rect.bottom + buffer;
    } else if (this.resizableSide === 'left') {
      return event.clientX > rect.left - buffer && event.clientX < rect.left + buffer;
    } else if (this.resizableSide === 'top') {
      return event.clientY > rect.top - buffer && event.clientY < rect.top + buffer;
    }

    return false;
  }

  private resize(event: MouseEvent) {
    let newWidth = this.startWidth;
    let newHeight = this.startHeight;

    if (this.resizableSide === 'right') {
      newWidth = this.startWidth + (event.clientX - this.startX);
    } else if (this.resizableSide === 'bottom') {
      newHeight = this.startHeight + (event.clientY - this.startY);
    } else if (this.resizableSide === 'left') {
      newWidth = this.startWidth - (event.clientX - this.startX);
      this.renderer.setStyle(this.el.nativeElement, 'left', `${event.clientX}px`);
    } else if (this.resizableSide === 'top') {
      newHeight = this.startHeight - (event.clientY - this.startY);
      this.renderer.setStyle(this.el.nativeElement, 'top', `${event.clientY}px`);
    }

    this.renderer.setStyle(this.el.nativeElement, 'width', `${newWidth}px`);
    this.renderer.setStyle(this.el.nativeElement, 'height', `${newHeight}px`);
  }

  private updateCursor(event: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    let cursorStyle = 'default';

    if (this.isInResizeZone(event, rect)) {
      if (this.resizableSide === 'right' || this.resizableSide === 'left') {
        cursorStyle = 'ew-resize';
      } else if (this.resizableSide === 'bottom' || this.resizableSide === 'top') {
        cursorStyle = 'ns-resize';
      }
    }
    if (cursorStyle !== 'default') {
      this.renderer.addClass(this.el.nativeElement, 'cursor-in-zone');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'cursor-in-zone');
    }
    this.renderer.setStyle(this.el.nativeElement, 'cursor', cursorStyle);
  }
}
