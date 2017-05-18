/**
 * Add custom settings to Jasmine.
 */

var reporters = require('jasmine-reporters');
var junitReporter = new reporters.JUnitXmlReporter({
  savePath: __dirname + '/test-results',
  consolidateAll: false,
  filePrefix: 'junit-'
});

jasmine.getEnv().addReporter(junitReporter);