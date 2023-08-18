describe('AFG and Explainer Page validation from home page', () => {
  it('finds and navigates to AFG home page', () => {
    cy.visit('http://localhost:9000/')
    cy.contains("Your Guide to America's Finances").click()
    cy.url().should('include', '/americas-finance-guide/')
  })

  it('finds and navigates to debt explainer', () => {
    cy.visit('http://localhost:9000/')
    cy.contains("What is the national debt?").click()
    cy.url().should('include', '/national-debt/')
  })

  it('finds and navigates to deficit explainer', () => {
    cy.visit('http://localhost:9000/')
    cy.contains("What is the national deficit?").click()
    cy.url().should('include', '/national-deficit/')
  })

  it('finds and navigates to spending explainer', () => {
    cy.visit('http://localhost:9000/')
    cy.contains("How much has the U.S. government spent this year?").click()
    cy.url().should('include', '/federal-spending/')
  })

  it('finds and navigates to revenue explainer', () => {
    cy.visit('http://localhost:9000/')
    cy.contains("How much has the U.S. government collected this year?").click()
    cy.url().should('include', '/government-revenue/')
  })
})
