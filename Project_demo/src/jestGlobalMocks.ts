import 'jest';

jest.mock('./app/core/services/adal/adal.service', () => {
  return class {

  };
});

jest.mock('./app/core/services/AzureMonitoringService', () => {
  return class {
    init(instrumentationKey: string) {
    }

    logPageView(name?: string, url?: string, properties?: any, measurements?: any, duration?: number) {
    }

    logEvent(name: string, properties?: any, measurements?: any) {
    }

    logException(exception: Error, properties?: any, measurements?: any) {
    }
  };
});
