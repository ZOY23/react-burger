describe('Конструктор бургеров', () => {
  before(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
  });

  beforeEach(() => {
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Должен перетаскивать ингредиенты в конструктор', () => {
    // 1. Проверяем загрузку ингредиентов
    cy.get('[data-testid^="ingredient-"]').should('have.length.gt', 0);

    // 2. Перетаскиваем булку
    cy.get('[data-testid^="ingredient-"]')
      .contains('булка')
      .first()
      .as('bun')
      .should('be.visible');

    const dataTransfer = new DataTransfer();
    
    cy.get('@bun')
      .trigger('mousedown', { button: 0 })
      .trigger('dragstart', { dataTransfer, force: true });

    cy.get('[data-testid="burger-constructor"]')
      .should('be.visible')
      .trigger('dragover', { dataTransfer, force: true })
      .trigger('drop', { dataTransfer, force: true })
      .trigger('dragend', { force: true });

    // 3. Проверяем добавление булки
    cy.get('[data-testid="constructor-bun-top"]', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="constructor-bun-bottom"]', { timeout: 10000 }).should('exist');

    // 4. Перетаскиваем начинку (с принудительным действием)
    cy.get('[data-testid^="ingredient-"]')
      .not(':contains("булка")')
      .first()
      .as('filling')
      .trigger('mousedown', { button: 0 })
      .trigger('dragstart', { dataTransfer, force: true });

    cy.get('[data-testid="constructor-ingredients"]')
      .trigger('dragover', { dataTransfer, force: true })
      .trigger('drop', { dataTransfer, force: true })
      .trigger('dragend', { force: true });

    cy.wait(500);
   
    // 5. Проверяем кнопку заказа
    cy.get('[data-testid="order-button"]')
      .should('be.visible')
      .and('not.be.disabled');
  });
});