import {
  Directive,
  HostListener,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  constructor(private el: ElementRef) {}

  @Input() menuOpen: boolean;
  @Output() clickOutside: EventEmitter<any> = new EventEmitter();

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement || !this.menuOpen) {
      return;
    }
    const clickedInside = this.el.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
