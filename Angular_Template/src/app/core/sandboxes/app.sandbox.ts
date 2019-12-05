import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as actionsSettings from '@app/core/store/settings/settings.actions';
import { environment } from 'environments/environment';
import { Sandbox } from '@app/core/sandboxes/base.sandbox';
import { UtilService } from '@app/core/services/util.service';
import { Observable } from 'rxjs';
import { RouterService } from '@app/core/services/router.service';
import { RouterReducerState } from '@ngrx/router-store';
import { getIsOnline, State } from '@app/core/store/store';

@Injectable({
  providedIn: 'root'
})
export class AppSandbox extends Sandbox {
  public online$: Observable<boolean> = this.store.pipe(
    select(getIsOnline)
  );
  // prettier-ignore
  public router$: Observable<RouterReducerState> = this.store.select('router');
  private localisation: any = environment.localisation;

  constructor(
    store: Store<State>,
    private translate: TranslateService,
    private utilService: UtilService,
    private routerService: RouterService
  ) {
    super(store);
  }

  /**
   * Sets up default language for the application. Uses browser default language.
   */
  public setupLanguage(): void {
    const languages: Array<string> = this.localisation.languages.map(
      lang => lang.code
    );
    const browserLang: string = this.translate.getBrowserLang();

    this.translate.addLangs(languages);
    this.translate.setDefaultLang(this.localisation.defaultLanguage);

    const selectedLang = browserLang.match(/en|nl/)
      ? browserLang
      : this.localisation.defaultLanguage;

    this.setLanguage(selectedLang);
  }

  /**
   * Sets the language with the give language code
   * @param selectedLang string
   */
  public setLanguage(selectedLang: string): void {
    const selectedCulture = this.localisation.languages.filter(
      lang => lang.code === selectedLang
    )[0].culture;

    this.translate.use(selectedLang);
    this.store.dispatch(new actionsSettings.SetLanguage(selectedLang));
    this.store.dispatch(new actionsSettings.SetCulture(selectedCulture));
  }

  /**
   * Checks if the application is online
   */
  public checkOnlineStatus(): void {
    this.utilService.checkOnlineStatus().subscribe(isOnline => {
      this.store.dispatch(new actionsSettings.SetOnline(isOnline));
    });
  }

  navigateToModule(path: string) {
    this.routerService.navigate(path);
  }
}
