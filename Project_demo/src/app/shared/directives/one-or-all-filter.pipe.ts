import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'oneOrAllFilter' })
export class OneOrAllFilter implements PipeTransform {
  transform(array: Object[], collapsed: boolean) {
    return collapsed && array.length > 1 ? [array[0]] : array;
  }
}
