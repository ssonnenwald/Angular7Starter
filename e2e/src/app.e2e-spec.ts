import { AppPage } from './app.po';
import { browser, protractor } from 'protractor';

describe('Angular 7', () => {
  let page: AppPage;

  beforeAll(() => {
    // Setting the Jasmine async timeout max.
    // So long running async calls don't fail.
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999;

    page = new AppPage();

    page.navigateTo();
    browser.waitForAngular();
  });

  afterAll(() => {

  });

  beforeEach(() => {

  });

  it('should display page title', () => {
    expect(page.getPageTitle()).toEqual('Angular 7');
  });

  it('Should get the Login/Logout button', () => {
    expect(page.getLoginLogoutButton().getText()).toEqual('Login');
  });

  it('Should display a login dialog when the login button is clicked', () => {
    const loginButton = page.getLoginLogoutButton();

    loginButton.click();

    browser.wait(protractor.ExpectedConditions.visibilityOf(page.getLoginDialog()), 5000).then(() => {
      expect(page.getLoginDialog()).toBeDefined();

      // Close the login dialog.
      page.getDialogCloseButton().click();
    });
  });
});
