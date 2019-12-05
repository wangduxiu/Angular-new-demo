import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'europool-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {

  private timeoutId;

  year = new Date().getFullYear();

  @Input() isEpsUser;
  @Input() autologoutDisabled = false;
  @Output() toggleAutologout = new EventEmitter();
  version = environment.version;
  buildDate = environment.buildDate;
  private clicked = 0;

  versionClicked() {
    this.clicked++;
    if (this.clicked === 5) {
      this.toggleAutologout.emit();
      clearTimeout(this.timeoutId);
      this.clicked = 0;
    } else if (this.clicked === 1) {
      this.timeoutId = setTimeout(()=>this.clicked = 0, 5000); // Reset click counter after 5 seconds
    }
  }
}
