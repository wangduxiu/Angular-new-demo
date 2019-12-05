import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmbedVideoService } from 'ngx-embed-video';

@Component({
  selector: 'app-tutorial-content',
  templateUrl: './tutorial-content.component.html',
  styleUrls: ['./tutorial-content.component.less']
})
export class TutorialContentComponent {
  public tutorialInfo: any = {};
  @Input()
  public set tutorial(val: any) {
    if (val) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(val.url);
      this.tutorialInfo = val;
    }
  }
  @Input() nextTutorialTitle: string;
  @Input() prevTutorialTitle: string;
  @Input() status: any;
  @Output() nextTutorial = new EventEmitter();
  @Output() prevTutorial = new EventEmitter();
  public safeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }
}
