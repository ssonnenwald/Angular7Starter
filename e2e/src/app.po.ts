import { browser, by, element, ElementFinder } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getPageTitle() {
    return browser.getTitle();
  }

  getLoginLogoutButton(): ElementFinder {
    return element(by.css('#btnLoginLogout'));
  }

  getLoginDialog(): ElementFinder {
    return element(by.css('#mat-dialog-0'));
  }

  getDialogCloseButton(): ElementFinder {
    return element(by.css('#closebtn'));
  }
}
