describe('Burger Constructor', () => {
  beforeEach(() => {
    // Загружаем mock-данные и открываем конструктор
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('should drag and drop ingredients and create an order', () => {
    // Проверяем, что ингредиенты загружены
    cy.get('[data-testid="ingredient-item"]').should('have.length.at.least', 1);

    // Перетаскиваем булку в конструктор
    cy.get('[data-testid="ingredient-bun"]').first().drag('[data-testid="constructor-bun-top"]');
    cy.get('[data-testid="constructor-bun-top"]').should('contain', 'Test Bun');
    cy.get('[data-testid="constructor-bun-bottom"]').should('contain', 'Test Bun');

    // Перетаскиваем ингредиент в конструктор
    cy.get('[data-testid="ingredient-main"]').first().drag('[data-testid="constructor-ingredients"]');
    cy.get('[data-testid="constructor-ingredients"]').should('contain', 'Test Ingredient');

    // Проверяем, что кнопка "Оформить заказ" активна
    cy.get('[data-testid="order-button"]').should('not.be.disabled');

    // Мокаем ответ API для создания заказа
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');

    // Кликаем на кнопку (если пользователь не авторизован, должен появиться модал)
    cy.get('[data-testid="order-button"]').click();

    // Проверяем модальное окно авторизации
    cy.get('[data-testid="auth-modal"]').should('exist');

    // Авторизуемся (используя кастомную команду)
    cy.login('test@example.com', 'password');

    // Повторно пытаемся создать заказ
    cy.get('[data-testid="order-button"]').click();
    cy.wait('@createOrder');

    // Проверяем модальное окно с номером заказа
    cy.get('[data-testid="order-modal"]').should('exist');
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="order-modal"]').should('not.exist');

    // Проверяем, что конструктор очистился
    cy.get('[data-testid="constructor-bun-top"]').should('be.empty');
    cy.get('[data-testid="constructor-ingredients"]').should('be.empty');
  });
});