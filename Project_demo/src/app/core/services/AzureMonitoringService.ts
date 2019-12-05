import { Injectable } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';

@Injectable()
export class AzureMonitoringService {

  loaded: boolean = false;
  verboseLogging: boolean = false;

  // TODO Angular training: ask how to get something from store in a service. Workaround: init called by cookieEffect. Got problem when injecting CookieService too.  Can't understand why
  constructor() {
  }

  init(instrumentationKey: string, verboseLogging: boolean) {
    AppInsights.downloadAndSetup({
      instrumentationKey
    });
    this.loaded = true;
    this.verboseLogging = verboseLogging;
  }

  logPageView(name?: string, url?: string, properties?: any, measurements?: any, duration?: number) {
    this.loaded && AppInsights.trackPageView(name, url, properties, measurements, duration);
  }

  logEvent(name: string, properties?: any, measurements?: any) {
    this.loaded && this.verboseLogging && AppInsights.trackEvent(name, properties, measurements);
  }

  logException(exception: Error, properties?: any, measurements?: any) {
    this.loaded && AppInsights.trackException(exception, properties, measurements);
  }
}
