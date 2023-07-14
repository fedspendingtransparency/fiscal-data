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
    cy.findByTestId('quarter-selector').should('have.text', 'Quarter2nd')
    cy.findByText('March 31, 2023').should('be.visible')
  })


  it('currency boxes', () => {
    cy.visit('https://fiscaldata.treasury.gov')
    cy.contains('Currency Exchange Rates Converter Tool').click()
    cy.findByTestId('box-container').findByTestId('input').should('be.visible')
    cy.findByTestId('box-container').findByTestId('input-dropdown').should('be.visible')
    // US Currency Box influences non US currency box
    cy.findByTestId('box-container').findByTestId('input').clear()
    cy.findByTestId('box-container').findByTestId('input').type('2')
    cy.findByTestId('box-container').findByTestId('input-dropdown').should('have.value', '1.84')
    // Non US Currency Box influences US currency box
    cy.findByTestId('box-container').findByTestId('input-dropdown').clear()
    cy.findByTestId('box-container').findByTestId('input-dropdown').type('2')
    cy.findByTestId('box-container').findByTestId('input').should('have.value', '2.17')
  })

})
