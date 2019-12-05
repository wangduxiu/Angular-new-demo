import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
  transform(text: string, limit: number = 140): any {
    if (!text) {
      return;
    }
    return (
      text
        .split(' ')
        .slice(0, limit)
        .join(' ') + '...'
    );
  }
}
