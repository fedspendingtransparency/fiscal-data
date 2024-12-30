describe('Glossary terms opens and closes', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Verifies sorting by name', () => {
    cy.findAllByText('Resources').click();
    cy.findAllByText('Glossary').click();
    cy.findByText('Search the glossary').should('exist');
  });

  it('Verifies sorting by name', () => {
    cy.findAllByText('Resources').click();
    cy.findAllByText('Glossary').click();
    cy.findByLabelText('Close glossary').click();
    cy.findByText('Search the glossary').should('not.exist');
  });
});

describe('Glossary terms interaction flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.findAllByText('Resources').click();
    cy.findAllByText('Glossary').click();
  });

  it('Search bar search interaction', () => {
    cy.findAllByLabelText('Search the glossary').should('be.visible');
    cy.findAllByLabelText('Search the glossary')
      .eq(1)
      .type('Revenue');
    cy.findAllByText('Back to list')
      .should('exist')
      .click();
    cy.findAllByLabelText('Search the glossary')
      .eq(1)
      .type('Debt Ceiling')
      .click();
    cy.findAllByText('Back to list')
      .should('exist')
      .click();
  });
  it('Search bar click into a selected search', () => {
    cy.findAllByLabelText('Search the glossary')
      .eq(1)
      .type('Debt Ceiling');
    cy.findAllByText('Debt Ceiling')
      .should('exist')
      .click();
    cy.findAllByText(
      'This is the maximum amount of money the federal government is allowed to borrow without receiving additional authority from Congress.'
    ).should('exist');
  });
  it('Search bar interaction with Floating Rate Notes and external link', () => {
    cy.findAllByLabelText('Search the glossary')
      .eq(1) // Target the correct search bar
      .should('be.visible')
      .type('Floating Rate Notes');
    cy.findAllByText('Floating Rate Notes')
      .should('exist')
      .click();
    cy.findAllByText('TreasuryDirect')
      .should('exist')
      .invoke('attr', 'href')
      .should('include', '/marketable-securities/floating-rate-notes/');

    cy.findAllByText('TreasuryDirect')
      .invoke('removeAttr', 'target')
      .click();
  });
  it('Search bar click into a selected search', () => {
    cy.findAllByLabelText('Close glossary').click();
    cy.findAllByText('Glossary').should('not.exist');
  });
});
