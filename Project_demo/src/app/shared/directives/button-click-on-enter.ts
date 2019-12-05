import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { util } from '../../core/util/util';


@Directive({
  selector: '[button-click-on-enter]',
})
export class ButtonClickOnEnterDirective {

  private id: number;
  @Input('button-click-on-enter') onEnterFn: Function;
  @Input('is-modal') isModal: boolean;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('window:keydown.enter', ['$event'])
  onEnterWindow(event: KeyboardEvent) {
    let modalWindowVisible = util.modalWindowVisible();
    if ((this.isModal && modalWindowVisible) || !modalWindowVisible) {
      this.elementRef.nativeElement.click();
    }
  }
}
