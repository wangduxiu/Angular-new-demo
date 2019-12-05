import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialsRoutingModule } from './tutorials-routing.module';
import { AngularMaterialModule } from '../../shared/angular-material/angular-material.module';
import { SharedModule } from 'app/shared';
import { CoreModule } from 'app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AdalModule } from 'app/core/services/adal/adal.module';
import { TutorialPageContainer } from './tutorial-page-container/tutorial-page.container';
import { TutorialMenuComponent } from './tutorial-menu/tutorial-menu.component';
import { TutorialContentComponent } from './tutorial-content/tutorial-content.component';
import { EmbedVideo } from 'ngx-embed-video';

@NgModule({
  imports: [
    CommonModule,
    TutorialsRoutingModule,
    AngularMaterialModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule,
    EmbedVideo.forRoot()
  ],
  declarations: [
    TutorialPageContainer,
    TutorialMenuComponent,
    TutorialContentComponent
  ]
})
export class TutorialsModule {}
