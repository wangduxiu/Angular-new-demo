import { Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[sortable-header]',
})
export class SortableHeaderDirective implements OnChanges {

  @HostListener('click')
  onClick() {
    this.sortFn(this.fieldName);
  }

  @Input('sortFn') sortFn: Function;

  @Input('sortable-header') fieldName: string;

  @Input('sortField') sortField: string;

  @Input('sortAscending') sortAscending: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, 'sort-sortable');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.fieldName === this.sortField) {
      if (this.sortAscending) {
        this.renderer.addClass(this.el.nativeElement, 'sort-ascending');
        this.renderer.removeClass(this.el.nativeElement, 'sort-descending');
        this.renderer.removeClass(this.el.nativeElement, 'sort-sortable');
      } else {
        this.renderer.addClass(this.el.nativeElement, 'sort-descending');
        this.renderer.removeClass(this.el.nativeElement, 'sort-ascending');
        this.renderer.removeClass(this.el.nativeElement, 'sort-sortable');
      }
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'sort-ascending');
      this.renderer.removeClass(this.el.nativeElement, 'sort-descending');
      this.renderer.addClass(this.el.nativeElement, 'sort-sortable');
    }
  }
}
