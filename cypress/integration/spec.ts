describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('ng container terminal demo');
    // cy.contains('sandbox app is running!')
  });
});
