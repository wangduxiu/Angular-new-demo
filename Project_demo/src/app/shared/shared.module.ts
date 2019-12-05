import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {UnsupportedBrowserComponent} from './unsupported-browser/unsupported-browser.component';
import {WorkInProgressComponent} from './work-in-progress/work-in-progress.component';
import {CoreModule} from '../core/core.module';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {FormComponentsModule} from './form-components/form-components.module';
import {WindowComponent} from './window/window.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {DirectivesModule} from './directives/directives.module';
import {ModalComponent} from './modal/modal.component';
import {ModalMessageComponent} from './modal/modal-message.component';
import {LoginComponent} from './login/login.component';
import {AdalModule} from '../core/services/adal/adal.module';
import {SvgConnectorComponent} from './svg-connector/svg-connector.component';
import {SvgArrowComponent} from './svg-arrow/svg-arrow.component';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import {TitleComponent} from './title/title.component';
import {StatusComponent} from './status/status.component';
import {AngularMaterialModule} from './angular-material/angular-material.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SelectEmailAddressesModalComponent} from './modal/modal-select-email-addresses.component';
import {ReactiveFormsModule} from '@angular/forms';
import {JasperoConfirmationsModule} from '@jaspero/ng2-confirmations';
import {LoadingbarComponent} from './loadingbar/loadingbar.component';
import {TutorialPopupComponent} from './tutorial-popup/tutorial-popup.component';
import {ClipboardModule} from 'ngx-clipboard';
import {PagerComponent} from './pager/pager.component';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    CoreModule,
    FormComponentsModule,
    DirectivesModule,
    NgxPaginationModule,
    AngularMultiSelectModule,
    AdalModule,
    NgbModule,
    ReactiveFormsModule,
    JasperoConfirmationsModule,
    ClipboardModule,
  ],
  exports: [
    AngularMaterialModule,
    FooterComponent,
    HeaderComponent,
    WindowComponent,
    FormComponentsModule,
    DirectivesModule,
    NgxPaginationModule,
    AngularMultiSelectModule,
    JasperoConfirmationsModule,
    ClipboardModule,

    SvgConnectorComponent,
    SvgArrowComponent,
    AdalModule,
    StatusComponent,
    TitleComponent,
    LoadingbarComponent,
    TutorialPopupComponent,
    PagerComponent,
  ],
  declarations: [
    PageNotFoundComponent,
    UnsupportedBrowserComponent,
    WorkInProgressComponent,
    FooterComponent,
    HeaderComponent,
    WindowComponent,
    LoginComponent,
    StatusComponent,
    SvgConnectorComponent,
    SvgArrowComponent,
    ModalComponent,
    ModalMessageComponent,
    TitleComponent,
    SelectEmailAddressesModalComponent,
    LoadingbarComponent,
    TutorialPopupComponent,
    PagerComponent,
  ],
})
export class SharedModule { }
