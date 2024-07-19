import { Directive, HostListener, Input, ComponentRef, ViewContainerRef, ComponentFactoryResolver, Renderer2 } from '@angular/core';
import { ContextMenuComponent } from '../components/context-menu/context-menu.component';
import { ContextMenuItem } from '../interfaces/ContextMenu';

@Directive({
  selector: '[appContextMenu]',
  standalone: true
})
export class ContextMenuDirective {
  @Input('appContextMenu') contextMenuItems: ContextMenuItem[] = [];

  private contextMenuComponentRef: ComponentRef<ContextMenuComponent> | null = null;
  private static currentContextMenu: ComponentRef<ContextMenuComponent> | null = null;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2
  ) {}

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    console.log('Right Clicked:', event);
    event.preventDefault();

    this.closeContextMenu();

    const factory = this.componentFactoryResolver.resolveComponentFactory(ContextMenuComponent);
    this.contextMenuComponentRef = this.viewContainerRef.createComponent(factory);
    this.contextMenuComponentRef.instance.items = this.contextMenuItems;

    const contextMenuElem = this.contextMenuComponentRef.location.nativeElement as HTMLElement;
    document.body.appendChild(contextMenuElem);

    console.log('Context Menu Element:', contextMenuElem);
    console.log('Context Menu Items:', this.contextMenuItems);

    // Set styles for positioning
    contextMenuElem.style.position = 'absolute';
    contextMenuElem.style.left = `${event.clientX}px`;
    contextMenuElem.style.top = `${event.clientY}px`;

    // Close previous context menu if another one is opened
    if (ContextMenuDirective.currentContextMenu) {
      ContextMenuDirective.currentContextMenu.destroy();
    }
    ContextMenuDirective.currentContextMenu = this.contextMenuComponentRef;

    // Add event listener for clicks outside the context menu
    this.renderer.listen('document', 'click', (clickEvent: MouseEvent) => {
      if (this.contextMenuComponentRef && !contextMenuElem.contains(clickEvent.target as Node)) {
        this.closeContextMenu();
      }
    });
  }

  closeContextMenu(): void {
    if (this.contextMenuComponentRef) {
      this.contextMenuComponentRef.destroy();
      this.contextMenuComponentRef = null;
      ContextMenuDirective.currentContextMenu = null;
    }
  }
}