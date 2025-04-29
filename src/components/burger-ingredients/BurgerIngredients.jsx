import React, { useState } from 'react';
import { Tab, Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import styles from './BurgerIngredients.module.css';
import { Modal } from '../modal/modal';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { useDrag } from 'react-dnd';
import { useAppSelector } from '../../services/store/store';
import { IngredientType } from '../../utils/types';

export const BurgerIngredients = () => {
  const [currentTab, setCurrentTab] = useState('bun');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const { items: ingredients } = useAppSelector(state => state.ingredients);
  const { bun, ingredients: constructorIngredients } = useAppSelector(state => state.burgerConstructor);

  const ingredientsByType = {
    bun: ingredients.filter(item => item.type === 'bun'),
    sauce: ingredients.filter(item => item.type === 'sauce'),
    main: ingredients.filter(item => item.type === 'main')
  };

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    document.getElementById(tab).scrollIntoView({ behavior: 'smooth' });
  };

  const handleIngredientClick = (ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const closeModal = () => {
    setSelectedIngredient(null);
  };

  const getCount = (ingredient) => {
    if (ingredient.type === 'bun') {
      return bun && bun._id === ingredient._id ? 2 : 0;
    }
    return constructorIngredients.filter(item => item._id === ingredient._id).length;
  };

  return (
    <section className={styles.section}>
      <h1 className="text text_type_main-large mb-5">Соберите бургер</h1>
      
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

      <div className={styles.ingredientsContainer}>
        {Object.entries(ingredientsByType).map(([type, items]) => (
          <section key={type} id={type}>
            <h2 className="text text_type_main-medium mb-6">
              {type === 'bun' ? 'Булки' : type === 'sauce' ? 'Соусы' : 'Начинки'}
            </h2>
            <div className={styles.ingredientsGrid}>
              {items.map((item) => (
                <IngredientCard 
                  key={item._id} 
                  ingredient={item}
                  count={getCount(item)}
                  onClick={handleIngredientClick}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={closeModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </section>
  );
};

const IngredientCard = ({ ingredient, count, onClick }) => {
  const [, dragRef] = useDrag({
    type: 'ingredient',
    item: { ingredient },
  });

  return (
    <div 
      ref={dragRef}
      className={styles.card}
      onClick={() => onClick(ingredient)}
      data-testid={`ingredient-${ingredient._id}`}
    >
      {count > 0 && (
        <Counter count={count} size="default" />
      )}
      <img src={ingredient.image} alt={ingredient.name} className={styles.image} />
      <div className={`${styles.price} mt-1 mb-1`}>
        <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`text text_type_main-default ${styles.name}`}>{ingredient.name}</p>
    </div>
  );
};

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(IngredientType).isRequired,
};