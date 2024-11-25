describe('Release calendar interaction flow', () => {

  it('Navigate to the release calendar page', () => {
   
    cy.visit('/');
    cy.findByLabelText('Page links for Resources').click(); 
    cy.contains('Release Calendar').click();
    cy.url().should('include', '/release-calendar/');
    });
  });


describe('Release calendar interaction flow', () => {
  beforeEach(() => {
    cy.visit('/release-calendar/');
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


