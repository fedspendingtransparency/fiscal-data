// const core = require('@actions/core');
// const github = require('@actions/github');
import core from '@actions/core';

try {
  // Fetch the value of the input 'who-to-greet' specified in action.yml
  core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);

  // Record the time of greeting as an output
  const time = new Date().toTimeString();
  core.setOutput('time', time);
} catch (error) {
  // Handle errors and indicate failure
  core.setFailed(error.message);
}
