import React, { useState } from 'react';
import { Tab, Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import styles from './BurgerIngredients.module.css';

const BurgerIngredients = ({ ingredients }) => {
  const [currentTab, setCurrentTab] = useState('bun');

  const ingredientsByType = {
    bun: ingredients.filter(item => item.type === 'bun'),
    sauce: ingredients.filter(item => item.type === 'sauce'),
    main: ingredients.filter(item => item.type === 'main')
  };

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    document.getElementById(tab).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.section}>
      <h1 className="text text_type_main-large mb-5">Соберите бургер</h1>
      
      {/* Навигационные табы */}
      <div className={`${styles.tabs} mb-10`}>
        <Tab 
          value="bun" 
          active={currentTab === 'bun'}
          onClick={() => handleTabClick('bun')}
        >
          Булки
        </Tab>
        <Tab 
          value="sauce" 
          active={currentTab === 'sauce'}
          onClick={() => handleTabClick('sauce')}
        >
          Соусы
        </Tab>
        <Tab 
          value="main" 
          active={currentTab === 'main'}
          onClick={() => handleTabClick('main')}
        >
          Начинки
        </Tab>
      </div>

      {/* Список ингредиентов с кастомным скроллом */}
      <div className={styles.ingredientsContainer}>
        {/* Секция булок */}
        <section id="bun">
          <h2 className="text text_type_main-medium mb-6">Булки</h2>
          <div className={styles.ingredientsGrid}>
            {ingredientsByType.bun.map((item) => (
              <IngredientCard 
                key={item._id} 
                ingredient={item} 
                count={0}
              />
            ))}
          </div>
        </section>

        {/* Секция соусов */}
        <section id="sauce">
          <h2 className="text text_type_main-medium mb-6">Соусы</h2>
          <div className={styles.ingredientsGrid}>
            {ingredientsByType.sauce.map((item) => (
              <IngredientCard 
                key={item._id} 
                ingredient={item} 
                count={0}
              />
            ))}
          </div>
        </section>

        {/* Секция начинок */}
        <section id="main">
          <h2 className="text text_type_main-medium mb-6">Начинки</h2>
          <div className={styles.ingredientsGrid}>
            {ingredientsByType.main.map((item) => (
              <IngredientCard 
                key={item._id} 
                ingredient={item} 
                count={0}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

// Компонент карточки ингредиента
const IngredientCard = ({ ingredient, count }) => {
  const { image, name, price } = ingredient;

  return (
    <div className={styles.card}>
      {count > 0 && (
        <Counter count={count} size="default" extraClass={styles.counter} />
      )}
      <img src={image} alt={name} className={styles.image} />
      <div className={`${styles.price} mt-1 mb-1`}>
        <span className="text text_type_digits-default mr-2">{price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`text text_type_main-default ${styles.name}`}>{name}</p>
    </div>
  );
};

// Пропсы  компонента
BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default BurgerIngredients;