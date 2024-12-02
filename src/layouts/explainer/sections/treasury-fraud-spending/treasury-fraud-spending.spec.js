import treasuryFraudSpendingSections from './treasury-fraud-spending';

describe('Treasury Fraud Spending explainer page sections', () => {
  it('returns 5 sections with headings and body components', () => {
    expect(treasuryFraudSpendingSections.length).toBe(5);
    expect(treasuryFraudSpendingSections[0].title).toBeDefined();
  });
});
