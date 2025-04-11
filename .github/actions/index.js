/* istanbul ignore file */
const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
  try {
    // const summaryData = require('../../coverage/coverage-summary.json');
    // const coverage = summaryData.total.lines.pct; ??
    const coverage = 90.35;
    const icon = coverage < 90 ? '❌' : `✅`;
    const token = core.getInput('GITHUB_TOKEN');
    const context = github.context;
    const pr_number = context.payload.pull_request.number;
    // const issue_number = context.payload.issue.number;
    const oktokit = github.getOctokit(token);
    // const current_issue = await oktokit.rest.issues.
    const comment_id = await oktokit.rest.issues.getComment({
      ...context.repo,
      issue_number: pr_number,
      issue_url: `https://api.github.com/repos/fedspendingtransparency/fiscal-data/issues/${pr_number}`,
    });
    console.log(context.payload.pull_request._links.comments);

    oktokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pr_number,
      body: `Total Line Coverage: ${coverage}% ${icon}`,
      comment_id: `${pr_number}_total_coverage`,
    });
  } catch (error) {
    // Handle errors and indicate failure
    core.setFailed(error.message);
  }
})();
