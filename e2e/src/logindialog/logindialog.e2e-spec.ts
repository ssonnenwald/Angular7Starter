import { LoginDialog  } from './logindialog.po';
import { browser, protractor } from 'protractor';

describe('Angular 7 - Login Dialog', () => {
  let loginDialog: LoginDialog;

  beforeAll(() => {
    // Setting the Jasmine async timeout max.
    // So long running async calls don't fail.
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999;

    loginDialog = new LoginDialog();

    loginDialog.navigateTo();
    browser.waitForAngular();

    // Open login dialog.
    loginDialog.getLoginLogoutButton().click();
  });

  beforeEach(() => {

  });

  afterAll(() => {
    // Logout
    loginDialog.getLoginLogoutButton().click();
  });

  it('Should display a title', () => {
    expect(loginDialog.getTitle().getText()).toEqual('Login');
  });

  it('Should display a close button', () => {
    expect(loginDialog.getCloseButton()).toBeDefined();
  });

  it('Should display textbox to enter the User Name', () => {
    expect(loginDialog.getTextBoxUsername()).toBeDefined();
  });

  it('Should display a textbox to enter the User Password', () => {
    expect(loginDialog.getTextBoxPassword()).toBeDefined();
  });

  it('Should display a login button', () => {
    expect(loginDialog.getLoginButton()).toBeDefined();
  });

  it('Login button is disabled if no user name or password', () => {
    expect(loginDialog.getLoginButton().isEnabled()).toBe(false);
  });

  it('Login button is enabled if a user name and password is entered', () => {
    (loginDialog.getTextBoxUsername()).sendKeys('admin');
    (loginDialog.getTextBoxPassword()).sendKeys('password');

    expect(loginDialog.getLoginButton().isEnabled()).toBe(true);

    (loginDialog.getTextBoxUsername()).clear();
    (loginDialog.getTextBoxPassword()).clear();

    browser.waitForAngular();
  });

  it('Should login with a valid user name and password', () => {
    (loginDialog.getTextBoxUsername()).sendKeys('admin');
    (loginDialog.getTextBoxPassword()).sendKeys('password');

    browser.sleep(1000);

    loginDialog.getLoginButton().click();

    browser.wait(protractor.ExpectedConditions.urlContains('home'), 5000).then(() => {
      expect(loginDialog.getSnackbarMessage().getText()).toEqual('Successfully logged in.');
    });

    browser.waitForAngular();
  });
});
