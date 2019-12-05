import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.less'],
})
export class TitleComponent {
  @Input()
  title: string;

  @Input()
  subtitle: string;
}
