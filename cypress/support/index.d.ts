/// <reference types="cypress" />
/// <reference types="cypress-wait-until" />

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>
    dragTo(targetSelector: string): Chainable<JQuery<HTMLElement>>
    safeGet(selector: string, options?: Partial<Loggable & Timeoutable>): Chainable<JQuery<HTMLElement>>
  }
}