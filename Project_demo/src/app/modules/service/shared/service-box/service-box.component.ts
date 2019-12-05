import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-service-box',
  templateUrl: './service-box.component.html',
  styleUrls: ['./service-box.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
})
export class ServiceBoxComponent {

  @Input() icon: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() description: string;
  @Input() redirectTo: string;
  @Input() showMailto: boolean = false;

  @Output() openModule = new EventEmitter<string>();

  constructor() {
  }
}
