import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Nu 'enableProdMode doen
if (environment.production) {
  enableProdMode();
}

  platformBrowserDynamic().bootstrapModule(AppModule);

/*

to be able to measure change detection performance

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(moduleRef => {
    const applicationRef = moduleRef.injector.get(ApplicationRef);
    const componentRef = applicationRef.components[0];
    // allows to run `ng.profiler.timeChangeDetection();`
    enableDebugTools(componentRef);
  })
  .catch(err => console.log(err));

in console on screen you wanna measure:
 ng.profiler.timeChangeDetection({ record: true }).
*/
