import { browser, by, element } from 'protractor';

export class AppToTest {
  /**
   * Navigate to an url
   * @param {string} url
   */
  navigateTo(url: string) {
    return browser.get(url);
  }

  /**
   * Get text from css property
   * @param {string} cssProperty
   */
  getText(cssProperty: string) {
    return element(by.css(cssProperty)).getText();
  }

  /**
   * Fills in an input field through id
   * @param {string} cssId
   * @param {string} value
   */
  setValue(cssId: string, value: string) {
    const input = element(by.id(cssId));
    input.sendKeys(value);
  }

  /**
   * Checks if a css property is enabled
   * @param cssProperty
   */
  isEnabled(cssProperty: string) {
    return element(by.css(cssProperty)).isEnabled();
  }

  /**
   * Clicks on a css property
   * @param cssProperty
   */
  click(cssProperty: string) {
    return element(by.css(cssProperty)).click();
  }

  /**
   * Checks if a css property is present
   * @param cssProperty
   */
  isPresent(cssProperty: string) {
    return element(by.css(cssProperty)).isPresent();
  }
}
