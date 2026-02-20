/* istanbul ignore file */
import * as core from '@actions/core';
import * as github from '@actions/github';
import summaryData from '../../coverage/coverage-summary.json' with { type: 'json' };

(async () => {
  try {
    const coverage = summaryData.total.lines.pct;
    const icon = coverage < 90 ? '❌' : `✅`;
    const token = core.getInput('GITHUB_TOKEN');
    const context = github.context;
    const pr_number = context.payload.pull_request.number;
    const oktokit = github.getOctokit(token);
    const pr_id = context.payload.pull_request.id;
    const pr_comments_response = await oktokit.rest.issues.listComments({
      ...context.repo,
      issue_number: pr_number,
      id: pr_id,
    });
    const pr_comments = pr_comments_response.data;
    const coverage_comment = pr_comments?.find(comment => comment.user.login === 'github-actions[bot]');
    if (pr_comments.length > 0 && coverage_comment) {
      oktokit.rest.issues.updateComment({
        ...context.repo,
        issue_number: pr_number,
        comment_id: coverage_comment.id,
        body: `Total Line Coverage: ${coverage}% ${icon}`,
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
