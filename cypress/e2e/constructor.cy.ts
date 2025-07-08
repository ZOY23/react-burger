/// <reference types="cypress" />
/// <reference types="cypress-wait-until" />

describe('Burger Constructor', () => {
  before(() => {
    Cypress.config('defaultCommandTimeout', 30000);
    Cypress.config('pageLoadTimeout', 60000);
    
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('POST', 'api/auth/login', { fixture: 'auth.json' }).as('login');
    cy.intercept('WS://*', { statusCode: 200 });
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/', {
      timeout: 30000,
      retryOnStatusCodeFailure: true,
      retryOnNetworkFailure: true
    });

    cy.document().should('have.property', 'readyState', 'complete');
    
    cy.get('[data-testid="home-page"]', { timeout: 20000 }).should('be.visible');
    cy.get('[data-testid="app-header"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="burger-ingredients-section"]', { timeout: 10000 }).should('exist');
    
    // Исправление: используем правильный синтаксис assertions для Cypress
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
  });

  it('should load main page elements correctly', () => {
    cy.get('[data-testid="app-header"]').should('be.visible');
    cy.get('[data-testid="ingredient-item"]').should('have.length.at.least', 2);
    cy.get('[data-testid="ingredient-bun"]').should('exist');
    cy.get('[data-testid="ingredient-main"]').should('exist');
    cy.get('[data-testid="burger-constructor"]').should('exist');
    cy.get('[data-testid="order-button"]').should('exist').and('be.disabled');
  });

  it('should handle drag and drop operations', () => {
    cy.get('[data-testid="ingredient-bun"]').first().as('bun').then(($bun) => {
      const bunName = $bun.find('p').text().trim();
      cy.get('@bun').dragTo('[data-testid="burger-constructor"]');
      
      cy.get('[data-testid="constructor-bun-top"]').should('contain', bunName);
      cy.get('[data-testid="constructor-bun-bottom"]').should('contain', bunName);
    });

    cy.get('[data-testid="ingredient-main"]').first().as('mainIngredient').then(($ingredient) => {
      const ingredientName = $ingredient.find('p').text().trim();
      cy.get('@mainIngredient').dragTo('[data-testid="constructor-ingredients"]');
      
      cy.get('[data-testid="constructor-ingredients"]').should('contain', ingredientName);
    });

    cy.get('[data-testid="order-button"]').should('not.be.disabled');
  });

  it('should complete order flow with authentication', () => {
    cy.get('[data-testid="ingredient-bun"]').first().dragTo('[data-testid="burger-constructor"]');
    cy.get('[data-testid="ingredient-main"]').first().dragTo('[data-testid="constructor-ingredients"]');

    cy.get('[data-testid="order-button"]').click();
    cy.get('[data-testid="auth-modal"]').should('be.visible');

    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password');
    cy.get('[data-testid="login-button"]').click();

    // Исправление: используем правильный синтаксис для проверки статус-кода
    cy.wait('@login').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="order-button"]').click();
    cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="order-modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="order-modal"]').should('not.exist');
  });

  afterEach(() => {
    cy.wait(1000);
  });
});