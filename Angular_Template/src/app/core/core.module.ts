import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { reducers } from '@app/core/store/store';
import { environment } from '../../environments/environment';
import { UtilService } from '@app/core/services/util.service';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomRouteSerializer } from '@app/core/store/router/customRouteSerializer';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    /**
     * Ngrx
     */
    StoreModule.forRoot(reducers, { metaReducers: [] }),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router', // name of reducer key
    }),
    /**
     * ng-translate
     */
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [],
  declarations: [],
  providers: [UtilService, { provide: RouterStateSerializer, useClass: CustomRouteSerializer }],
})
export class CoreModule {}
