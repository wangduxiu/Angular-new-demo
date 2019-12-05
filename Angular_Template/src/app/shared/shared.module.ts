import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ShortenPipe } from './pipes/shorten.pipe';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [
    RouterModule,
    TranslateModule,
    CommonModule,
    ShortenPipe
  ],
  declarations: [ShortenPipe],
  providers: []
})
export class SharedModule {}
