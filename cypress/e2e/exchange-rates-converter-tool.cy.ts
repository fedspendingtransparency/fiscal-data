describe('Exchange Rates Converter Tool User Interactions', () => {
  it('year and quarter selectors', () => {
    cy.visit('https://fiscaldata.treasury.gov')
    cy.contains('Currency Exchange Rates Converter Tool').click()
    // Using Cypress Testing Library (React Testing Library) query!
    cy.findByTestId('year-selector').should('be.visible')
    cy.findByTestId('quarter-selector').should('be.visible')
    cy.findByTestId('year-selector').click()
    cy.contains('2022').click()
    cy.findByTestId('quarter-selector').should('have.text', 'Quarter4th')
    cy.findByTestId('year-selector').click()
    cy.contains('2023').click()
    cy.findByTestId('quarter-selector').should('have.text', 'Quarter1st')
    cy.findByText('March 31, 2023').should('be.visible')
  })
})
