describe('Login Redirects', () => {
    it('should navigate to the Google redirect page', () => {
      cy.visit('http://localhost:3000/')
   
      cy.get('[data-cy="nav-login"]').click();

      cy.get('[data-cy="googleLogin"]').click();
      cy.url().should('include', 'https://accounts.google.com/v3/signin/identifier?')
    });
})