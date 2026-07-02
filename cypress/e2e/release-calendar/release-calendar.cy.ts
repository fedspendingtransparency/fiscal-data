const pageLoadTimeout = 15000;

const visitReleaseCalendarPage = () => {
  cy.intercept('GET', '**/services/api/fiscal_service/**').as('fiscalData');
  cy.visit('/release-calendar/');
  cy.wait('@fiscalData', { timeout: pageLoadTimeout })
    .its('response.statusCode')
    .should('be.oneOf', [200, 304]);
  cy.findAllByText('Released', { timeout: pageLoadTimeout })
    .should('exist')
    .should('be.visible');
};

describe('Release calendar interaction flow', () => {
  beforeEach(() => {
    visitReleaseCalendarPage();
  });
  it('Navigate to the release calendar page', () => {
    cy.findAllByText('The Fiscal Data Release Calendar shows estimated dates and times for upcoming data releases.').should('exist');
  });
  it('Verifies sorting by name', () => {
    cy.findAllByText('Date').click();
    cy.findAllByText('Name').click();
    cy.findByLabelText('Change Sort By: from Name').should('exist');
    cy.findAllByText('#').should('exist');
    cy.findAllByText('A').should('exist');
  });
  it('Verifies clicking on calender entry goes to correct page', () => {
    cy.findAllByText('Date').click();
    cy.findAllByText('Name').click();

    cy.findAllByText('120 Day Delinquent Debt Referral Compliance Report').click();
    cy.url().should('include', '/120-day-delinquent-debt-referral-compliance-report');
  });
  it('Verifies sorting by date', () => {
    cy.findByLabelText('Change Sort By: from Date').should('exist');
  });
});
