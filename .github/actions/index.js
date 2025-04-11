const core = require('@actions/core');
const github = require('@actions/github');

try {
  const summaryData = require('../../coverage/coverage-summary.json');
  const coverage = summaryData.total.lines.covered / summaryData.total.lines.total;
  const coverageFormatted = (coverage * 100).toPrecision(2);
  const token = core.getInput('GITHUB_TOKEN');
  const context = github.context;
  const pr_number = context.payload.pull_request.number;
  const oktokit = github.getOctokit(token);
  oktokit.rest.issues.createComment({
    ...context.repo,
    issue_number: pr_number,
    body: `Coverage: ${coverageFormatted}`,
  });
} catch (error) {
  // Handle errors and indicate failure
  core.setFailed(error.message);
}
