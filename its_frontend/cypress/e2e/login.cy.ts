export function register() {
  // Visit the order page
  cy.visit('/login');

  // check be relocated
  cy.findByRole('link', { name: /register/i }).click();
  cy.location('pathname').should('eq', '/register');

  // Fill out the form using accessible roles
  const loginData = {
    username: `test_user_${Math.random().toString(36).substring(2, 8)}`,
    password: '123456',
    email: `test_user_${Math.random().toString(36).substring(2, 8)}@example.com`,
  };
  // Save the username in Cypress environment
  Cypress.env('loginData', loginData);
  cy.findByRole('textbox', { name: /username/i }).type(loginData.username);
  cy.get('input[type="password"]').type(loginData.password);
  cy.findByRole('textbox', { name: /email/i }).type(loginData.email);

  // Submit the form
  cy.findByRole('button', { name: /submit/i }).click();

  cy.findByRole('dialog').find('[aria-label="register succeeded"]').should('exist');

  cy.findByRole('button', { name: /ok/i }).click();
  cy.location('pathname').should('eq', '/login');
}

export function login() {
  // Visit the login page
  cy.visit('/login');

  // Save the username in Cypress environment
  const loginData = Cypress.env('loginData');
  cy.findByRole('textbox', { name: /username/i }).type(loginData.username);
  cy.get('input[type="password"]').type(loginData.password);

  // Submit the form
  cy.findByRole('button', { name: /submit/i }).click();

  cy.findByRole('dialog').find('[aria-label="login succeeded"]').should('exist');

  cy.findByRole('button', { name: /ok/i }).click();
  cy.location('pathname').should('not.eq', '/login');
}

describe('Login and register logic', () => {
  it('should navigate /login without login', () => {
    // Visit the order page
    cy.visit('/order');

    // check be relocated
    cy.location('pathname').should('eq', '/login');
  });

  it('register new account', register);

  it('login', login);
});
