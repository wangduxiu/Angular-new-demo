import { AppToTest } from './app.po';
import { browser, element, until, by, ExpectedConditions } from 'protractor';

browser.waitForAngularEnabled(false);

describe('Angular template', () => {
  let appToTest: AppToTest;

  beforeEach(() => {
    appToTest = new AppToTest();
  });

  it('should load the app and display "Angular template"', () => {
    appToTest.navigateTo('/');
    expect(appToTest.getText('.title')).toEqual('Angular template');
  });
});
