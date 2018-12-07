// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
var jasmineReporters = require('jasmine-reporters');

var reportsDirectory = './reports';
var dashboardReportDirectory = reportsDirectory + '/dashboardReport';
var detailsReportDirectory = reportsDirectory + '/detailReport';

var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
var ScreenshotAndStackReporter = new HtmlScreenshotReporter({
    dest: detailsReportDirectory,
    filename: 'E2ETestingReport.html',
    reportTitle: "E2E Testing Report",
    showSummary: true,
    reportOnlyFailedSpecs: false,
    captureOnlyFailedSpecs: true,
});

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  beforeLaunch: function () {
    return new Promise(function (resolve) {
        ScreenshotAndStackReporter.beforeLaunch(resolve);
    });
  },
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    jasmine.getEnv().addReporter(ScreenshotAndStackReporter);
    
    // xml report generated for dashboard
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      consolidateAll: true,
      savePath: reportsDirectory + '/xml',
      filePrefix: 'xmlOutput'
    }));

    var fs = require('fs-extra');
    if (!fs.existsSync(dashboardReportDirectory)) {
        fs.mkdirSync(dashboardReportDirectory);
    }

    jasmine.getEnv().addReporter({
      specDone: function (result) {
          if (result.status == 'failed') {
              browser.getCapabilities().then(function (caps) {
                  var browserName = caps.get('browserName');

                  browser.takeScreenshot().then(function (png) {
                      var stream = fs.createWriteStream(dashboardReportDirectory + '/' + browserName + '-' + result.fullName + '.png');
                      stream.write(new Buffer(png, 'base64'));
                      stream.end();
                  });
              });
          }
      }
    });

    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });

    jasmine.getEnv().addReporter(new SpecReporter({ 
      spec: { 
        displayStacktrace: false,       // display stacktrace for each failed assertion
        displaySuccessesSummary: false, // display summary of all successes after execution 
        displayFailuresSummary: true,   // display summary of all failures after execution 
        displayPendingSummary: true,    // display summary of all pending specs after execution 
        displaySuccessfulSpec: true,    // display each successful spec 
        displayFailedSpec: true,        // display each failed spec 
        displayPendingSpec: false,      // display each pending spec 
        displaySpecDuration: false,     // display each spec duration 
        displaySuiteNumber: false,      // display each suite number (hierarchical) 
        colors: {
            success: 'green',
            failure: 'red',
            pending: 'yellow'
        },
        prefixes: {
            success: '✓ ',
            failure: '✗ ',
            pending: '* '
        },
        customProcessors: [] 
      } 
    }));
  },
  onComplete: function () {
    var browserName, browserVersion;
    var capsPromise = browser.getCapabilities();

    capsPromise.then(function (caps) {
        browserName = caps.get('browserName');
        browserVersion = caps.get('version');
        platform = caps.get('platform');

        var HTMLReport = require('protractor-html-reporter-2');
        testConfig = {
            reportTitle: 'Protractor Test Execution Report',
            outputPath: dashboardReportDirectory,
            outputFilename: 'index',
            screenshotPath: './',
            testBrowser: browserName,
            browserVersion: browserVersion,
            modifiedSuiteName: false,
            screenshotsOnlyOnFailure: true,
            testPlatform: platform
        };
        new HTMLReport().from(reportsDirectory + '/xml/xmlOutput.xml', testConfig);
    });
  }
};