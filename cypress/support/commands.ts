/// <reference types="cypress" />
/// <reference types="cypress-wait-until" />
import '@testing-library/cypress/add-commands'
import 'cypress-real-events/support'
import 'cypress-wait-until'

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      dragTo(targetSelector: string): Chainable<JQuery<HTMLElement>>
      safeGet(selector: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable>): Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('login', (email, password) => {
  cy.intercept('POST', 'api/auth/login', { fixture: 'auth.json' }).as('login')
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="login-button"]').click()
  cy.wait('@login')
  return undefined
})

Cypress.Commands.add('dragTo', { prevSubject: 'element' }, (subject, targetSelector) => {
  const draggable = subject[0]
  const target = Cypress.$(targetSelector)[0]
  
  const dataTransfer = new DataTransfer()
  
  draggable.dispatchEvent(new DragEvent('dragstart', { dataTransfer }))
  target.dispatchEvent(new DragEvent('dragenter', { dataTransfer }))
  target.dispatchEvent(new DragEvent('dragover', { dataTransfer }))
  target.dispatchEvent(new DragEvent('drop', { dataTransfer }))
  draggable.dispatchEvent(new DragEvent('dragend', { dataTransfer }))

  return cy.wrap(subject)
})

Cypress.Commands.add('safeGet', (selector, options = {}) => {
  const defaultOptions = {
    timeout: 10000,
    retryInterval: 500
  }
  const mergedOptions = { ...defaultOptions, ...options }
  
  return cy.get(selector, mergedOptions).should('exist')
})