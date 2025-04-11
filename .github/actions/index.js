/* istanbul ignore file */
const core = require('@actions/core');
const github = require('@actions/github');

try {
  // const summaryData = require('../../coverage/coverage-summary.json');
  // const coverage = summaryData.total.lines.pct;
  const coverage = 90.35;
  const icon = coverage < 90 ? '❌' : `✅`;
  const token = core.getInput('GITHUB_TOKEN');
  const context = github.context;
  const pr_number = context.payload.pull_request.number;
  const issue_number = context.payload.issue.number;
  const oktokit = github.getOctokit(token);
  // await oktokit.rest.gists.listComments();
  // await oktokit.request(`PATCH /repos/fedspendingtransparency/fiscal-data/pull/${pr_number}`, {
  //   body: `Total Line Coverage: ${coverage}% ${icon}`,
  // });
  await oktokit.request(`GET /repos/{owner}/{repo}/issues/{issue_number}`, {
    owner: 'fedspendingtransparency',
    repo: 'fiscal-data',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

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
