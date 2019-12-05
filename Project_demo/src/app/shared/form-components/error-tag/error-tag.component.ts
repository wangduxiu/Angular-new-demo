import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-error',
  templateUrl: './error-tag.component.html',
  styleUrls: ['./error-tag.component.less'],
})
export class ErrorTagComponent {

  constructor(private translate: TranslateService) { }

  @Input() private translationCode: string;
  @Input() showError: boolean;

  translateError(key:string , value?: object) {
    return this.translate.instant(key, value);
  }

  get errorMessage() {
    return this.translateError(this.translationCode);
  }

}
