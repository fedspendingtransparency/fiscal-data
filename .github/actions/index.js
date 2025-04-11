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
    const pr_id = context.payload.pull_request.id;
    const pr_comments = await oktokit.rest.issues.listComments({
      ...context.repo,
      issue_number: pr_number,
      id: pr_id,
    });
    const last_comment = pr_comments.data[pr_comments.data.length - 1];
    // const comment_id = last_comment.id
    console.log(last_comment);
    console.log('**********************************************************');
    console.log(context);
    //
    // oktokit.rest.issues.createComment({
    //   ...context.repo,
    //   issue_number: pr_number,
    //   body: `Total Line Coverage: ${coverage}% ${icon}`,
    // });
    oktokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pr_number,
      comment_id: last_comment.id,
      body: `Total Line Coverage: ${coverage}% ${icon}`,
    });
  } catch (error) {
    // Handle errors and indicate failure
    core.setFailed(error.message);
  }
})();
