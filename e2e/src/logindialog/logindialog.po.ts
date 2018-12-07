import { browser, by, element, ElementFinder } from 'protractor';

export class LoginDialog {
  navigateTo() {
    return browser.get('/');
  }

  getTitle(): ElementFinder {
    browser.waitForAngular();
    return element(by.css('#spaTitle'));
  }

  getCloseButton(): ElementFinder {
    browser.waitForAngular();
    return element(by.css('#closebtn'));
  }

  getTextBoxUsername(): ElementFinder {
    browser.waitForAngular();
    return element(by.css('#Username'));
  }

  getTextBoxPassword(): ElementFinder {
    browser.waitForAngular();
    return element(by.css('#password'));
  }

  getLoginButton(): ElementFinder {
    browser.waitForAngular();
    return element(by.css('#btnSubmit'));
  }

  getSnackbarMessage(): ElementFinder {
    browser.waitForAngular();
    return element(by.css('simple-snack-bar>span'));
  }

  getLoginLogoutButton(): ElementFinder {
    browser.waitForAngular();
    return element(by.css('#btnLoginLogout'));
  }
}
