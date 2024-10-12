import { login, register } from "./login.cy";

describe('Car Plate Management', () => {
  const carPlate = 'ABC123';
  before(() => {
    register();
  });

  beforeEach(() => {
    login();
    cy.visit('/plate'); // Visit the plate page
  });

  it('should allow adding and displaying car plates', () => {
    // Type the car plate into the input field
    cy.get('input').type(carPlate);

    // Click the submit button
    cy.contains('Submit Car Plate').click();

    // Verify the car plate appears in the list
    cy.contains(carPlate).should('be.visible');
  });

  it('should allow deleting a car plate from the list', () => {
    // Add a car plate first
    cy.get('input').type(carPlate);
    cy.contains('Submit Car Plate').click();

    // Verify the car plate appears
    cy.contains(carPlate).should('be.visible');

    // Delete the car plate
    cy.get(`[aria-label="delete"]`).click();

    // Verify the car plate is no longer visible
    cy.contains(carPlate).should('not.exist');
  });
});
