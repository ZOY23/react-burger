/// <reference types="cypress" />
/// <reference types="cypress-wait-until" />

describe('Burger Constructor', () => {
  before(() => {
    // Устанавливаем таймаут ожидания сервера
    Cypress.config('defaultCommandTimeout', 30000)
    
    // Ждем пока сервер станет доступен
    cy.waitUntil(() => 
      cy.request('http://localhost:3000')
        .then((response) => response.status === 200),
      {
        timeout: 30000,
        interval: 1000
      }
    )

    // Мокаем API
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients')
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder')
    cy.intercept('POST', 'api/auth/login', { fixture: 'auth.json' }).as('login')
  })

  beforeEach(() => {
    cy.visit('/', {
      timeout: 30000,
      retryOnStatusCodeFailure: true,
      retryOnNetworkFailure: true
    })

    // Альтернативные проверки загрузки
    cy.get('body', { timeout: 20000 }).should('exist')
    cy.document().should('have.property', 'readyState', 'complete')
    
    // Проверяем ключевые элементы
    cy.get('[data-testid="app-header"]', { timeout: 20000 }).should('be.visible')
    cy.get('[data-testid="burger-ingredients-section"]', { timeout: 20000 }).should('exist')
    cy.wait('@getIngredients', { timeout: 5000 })
  })

  it('should load main page elements', () => {
    cy.get('[data-testid="app-header"]').should('be.visible')
    cy.get('[data-testid="ingredient-item"]').should('have.length.at.least', 1)
    cy.get('[data-testid="order-button"]').should('exist')
  })

  it('should drag and drop ingredients and create an order', () => {
    // Проверяем загрузку ингредиентов
    cy.get('[data-testid="ingredient-item"]').should('have.length.at.least', 1)

    // Перетаскиваем булку
    cy.get('[data-testid="ingredient-bun"]').first().then(($bun) => {
      const bunName = $bun.find('p').text().trim()
      return cy.wrap($bun).dragTo('[data-testid="burger-constructor"]')
    }).then(() => {
      cy.get('[data-testid="constructor-bun-top"]').should('exist')
      cy.get('[data-testid="constructor-bun-bottom"]').should('exist')
    })

    // Перетаскиваем основной ингредиент
    cy.get('[data-testid="ingredient-main"]').first().as('ingredient').then(($ingredient) => {
      const ingredientName = $ingredient.find('p').text().trim()
      cy.get('@ingredient').dragTo('[data-testid="constructor-ingredients"]')
      
      cy.get('[data-testid="constructor-ingredients"]').should('contain', ingredientName)
    })

    // Проверяем и кликаем кнопку заказа
    cy.get('[data-testid="order-button"]').should('not.be.disabled').click()
    
    // Проверяем модальное окно авторизации
    cy.get('[data-testid="auth-modal"]', { timeout: 5000 }).should('exist')
    
    // Логинимся
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').click()
    cy.wait('@login', { timeout: 5000 })

    // Повторяем заказ
    cy.get('[data-testid="order-button"]').click()
    cy.wait('@createOrder', { timeout: 5000 })

    // Проверяем модальное окно заказа
    cy.get('[data-testid="order-modal"]', { timeout: 5000 }).should('exist')
    cy.get('[data-testid="order-number"]').should('contain', '12345')

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close"]').click()
    cy.get('[data-testid="order-modal"]').should('not.exist')
  })
})