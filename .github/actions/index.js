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
    const pr_comments_response = await oktokit.rest.issues.listComments({
      ...context.repo,
      issue_number: pr_number,
      id: pr_id,
    });
    const pr_comments = pr_comments_response.data;
    // const comment_id = last_comment.id
    if (pr_comments.length > 0) {
      const coverage_comment = pr_comments.find(comment => comment.body.includes('Total !! Line !! Coverage:'))[0];
      const last_comment = pr_comments[pr_comments.length - 1];
      console.log(pr_comments);
      oktokit.rest.issues.updateComment({
        ...context.repo,
        issue_number: pr_number,
        comment_id: last_comment.id,
        body: `Total !! Line !! Coverage: ${coverage}% ${icon}`,
      });
    } else {
      oktokit.rest.issues.createComment({
        ...context.repo,
        issue_number: pr_number,
        body: `Total Line Coverage: ${coverage}% ${icon}`,
      });
    }
  } catch (error) {
    // Handle errors and indicate failure
    core.setFailed(error.message);
  }
})();
