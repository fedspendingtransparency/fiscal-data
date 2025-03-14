const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const summaryData = require('../../coverage/coverage-summary.json');
// const { XMLData } = require('../../coverage/clover.xml');

try {
  // Fetch the value of the input 'who-to-greet' specified in action.yml
  const nameToGreet = core.getInput('who-to-greet');
  const summaryData = require('../../coverage/coverage-summary.json');
  console.log('total: ', summaryData.total.lines.total, 'covered', summaryData.total.lines.total);

  // Record the time of greeting as an output
  const time = new Date().toTimeString();
  core.setOutput('time', time);
} catch (error) {
  // Handle errors and indicate failure
  core.setFailed(error.message);
}
