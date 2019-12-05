import { Component, OnInit } from '@angular/core';
import { AppSandbox } from '../core/sandboxes/app.sandbox';
import { environment } from 'environments/environment';
import { AbstractContainer } from '../shared/abstract/abstract.container';

@Component({
  selector: 'app-root',
  templateUrl: './app.container.html',
  styleUrls: ['./app.container.scss'],
  providers: [AppSandbox]
})
export class AppContainer extends AbstractContainer<AppSandbox>
  implements OnInit {
  title = 'Angular template';
  languages: any[] = environment.localisation.languages;
  isProduction: boolean = environment.production;
  isOnline = false;
  path: string;

  constructor(appSandbox: AppSandbox) {
    super(appSandbox);
  }

  // set the language by the given language code
  selectLang(code: string) {
    this.sandbox.setLanguage(code);
  }

  ngOnInit() {
    this.selectLang = this.selectLang.bind(this);

    this.sandbox.router$.subscribe((router: any) => {
      const currentPath: string = (router && router.state.url) || '';
      this.path = currentPath.startsWith('/') ? currentPath : '/' + currentPath;
    });

    this.sandbox.checkOnlineStatus(); // checks if the status of the application is online
    this.sandbox.setupLanguage(); // Sets up default language for the application. Uses browser default language.

    this.sandbox.online$.subscribe(isOnline => {
      this.isOnline = isOnline;
    });
  }

  openModule(path: string): void {
    this.sandbox.navigateToModule(path);
  }
}
