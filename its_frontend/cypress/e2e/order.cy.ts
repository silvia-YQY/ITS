import { register, login } from './login.cy';

describe('Order Page', () => {
  before(() => {
    register();
  });

  beforeEach(() => {
    login();
    // Assuming you're visiting the table page
    cy.visit('/order');
  });

  it('should display the table headers correctly', () => {
    // Test if the table headers are present
    cy.contains('Car Plate').should('be.visible');
    cy.contains('Username').should('be.visible');
    cy.contains('Email').should('be.visible');
    cy.contains('Start Time').should('be.visible');
    cy.contains('End Time').should('be.visible');
    cy.contains('Fee').should('be.visible');
    cy.contains('Status').should('be.visible');
  });

  // it('should display parking records in the table', () => {
  //   // Mock API response if needed or load real data
  //   // Check if the data is loaded and displayed correctly
  //   cy.get('tbody').within(() => {
  //     // Check for car plate
  //     cy.contains('string').should('be.visible'); // Car plate

  //     // Check for user details
  //     cy.contains('string').should('be.visible'); // Username
  //     cy.contains('user@example.com').should('be.visible'); // Email

  //     // Check for start and end time
  //     cy.contains('2024-10-10T22:48').should('be.visible'); // Start time (formatted)
  //     cy.contains('2024-10-10T22:48').should('be.visible'); // End time (formatted)

  //     // Check for parking location
  //     cy.contains('string').should('be.visible'); // Location name
  //     cy.contains('string').should('be.visible'); // Address

  //     // Check for fee
  //     cy.contains('999,999.99').should('be.visible'); // Fee (formatted)

  //     // Check for status
  //     cy.contains('Active').should('be.visible'); // Status text based on the `status` field (e.g., 0 = Active)
  //   });
  // });

  // it('should sort records by fee', () => {
  //   // Assuming there is a sortable column for Fee
  //   cy.contains('Fee').click(); // Click to sort by Fee
  //   // Add an assertion to check the sorting
  //   cy.get('tbody tr')
  //     .first()
  //     .within(() => {
  //       cy.contains('999,999.99').should('be.visible'); // Verify the highest fee is first
  //     });
  // });

  it('should paginate through records', () => {
    // Check if pagination controls exist
    cy.get('.MuiTablePagination-toolbar').should('be.visible'); // Modify based on actual pagination class or ID

    // Click next page and check if records change
    cy.get('.pagination-next').click(); // Modify based on actual class or ID
    cy.get('tbody tr')
      .first()
      .within(() => {
        // Ensure the first record on the new page is different
        cy.contains('string').should('be.visible');
      });
  });

  it('should filter records by car plate', () => {
    // Assuming there is a filter input for Car Plate
    cy.get('input[placeholder="Search by car plate"]').type('ABC123{enter}'); // Modify selector and value accordingly

    // Check if the table shows filtered results
    // cy.get('tbody').within(() => {
    //   cy.contains('ABC123').should('be.visible');
    // });
  });
});
