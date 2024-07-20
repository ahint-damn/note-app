import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  ComponentRef,
  ViewContainerRef,
  ComponentFactoryResolver,
} from '@angular/core';
import { TooltipComponent } from '../components/tooltip/tooltip.component';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText: string = '';

  private tooltipComponentRef: ComponentRef<TooltipComponent> | null = null;
  private mouseX: number = 0;
  private mouseY: number = 0;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.tooltipText) {
      return;
    }
    const factory =
      this.componentFactoryResolver.resolveComponentFactory(TooltipComponent);
    this.tooltipComponentRef = this.viewContainerRef.createComponent(factory);
    this.tooltipComponentRef.instance.tooltip = this.tooltipText;

    const tooltipElem = this.tooltipComponentRef.location
      .nativeElement as HTMLElement;
    document.body.appendChild(tooltipElem);

    this.updateTooltipPosition();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.updateTooltipPosition();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.tooltipComponentRef) {
      this.tooltipComponentRef.destroy();
      this.tooltipComponentRef = null;
    }
  }

  private updateTooltipPosition(): void {
    if (this.tooltipComponentRef) {
      const tooltipElem = this.tooltipComponentRef.location
        .nativeElement as HTMLElement;
      const tooltipWidth = tooltipElem.offsetWidth;
      const tooltipHeight = tooltipElem.offsetHeight;
      const margin = 10;

      let left = this.mouseX - tooltipWidth / 2;
      let top = this.mouseY + 20;

      // Check for screen edges and adjust position if necessary
      if (left < margin) {
        left = margin;
      } else if (left + tooltipWidth > window.innerWidth - margin) {
        left = window.innerWidth - tooltipWidth - margin;
      }

      if (top + tooltipHeight > window.innerHeight - margin) {
        top = this.mouseY - tooltipHeight - 20;
      }

      tooltipElem.style.position = 'absolute';
      tooltipElem.style.left = `${left}px`;
      tooltipElem.style.top = `${top}px`;
      tooltipElem.style.zIndex = '999999';
    }
  }
}
