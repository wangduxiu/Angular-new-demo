import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import 'rxjs/add/operator/distinctUntilChanged';
import { AdalModule } from '../../core/services/adal/adal.module';
import { TutorialPageContainer } from './tutorial-page-container/tutorial-page.container';

const routes: Routes = [
  {
    path: 'tutorials',
    component: TutorialPageContainer,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), AdalModule],
  exports: [RouterModule]
})
export class TutorialsRoutingModule { }
