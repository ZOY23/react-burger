import React, { useEffect, useState } from 'react';
import { Tab, Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerIngredients.module.css';
import { Modal } from '../modal/modal';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../services/store/store';
import { fetchIngredients } from '../../services/actions/ingredientsActions';
import { setCurrentIngredient, clearCurrentIngredient } from '../../services/slices/ingredientsSlice';
import {
  selectIngredients,
  selectCurrentIngredient,
  selectIngredientsLoading,
  selectIngredientsError
} from '../../services/selectors/ingredientsSelectors';
import {
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/selectors/constructorSelectors';

export const BurgerIngredients = () => {
  const dispatch = useAppDispatch();
  const [currentTab, setCurrentTab] = useState('bun');
  
  const ingredients = useAppSelector(selectIngredients);
  const loading = useAppSelector(selectIngredientsLoading);
  const error = useAppSelector(selectIngredientsError);
  const bun = useAppSelector(selectConstructorBun);
  const constructorIngredients = useAppSelector(selectConstructorIngredients);
  const currentIngredient = useAppSelector(selectCurrentIngredient);

  useEffect(() => {
    // Загружаем ингредиенты только если их нет и не идет уже загрузка
    if (ingredients.length === 0 && !loading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, loading]);

  const ingredientsByType = {
    bun: ingredients.filter(item => item.type === 'bun'),
    sauce: ingredients.filter(item => item.type === 'sauce'),
    main: ingredients.filter(item => item.type === 'main')
  };

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    document.getElementById(tab)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleIngredientClick = (ingredient) => {
    dispatch(setCurrentIngredient(ingredient));
  };

  const closeModal = () => {
    dispatch(clearCurrentIngredient());
  };

  const getCount = (ingredient) => {
    if (ingredient.type === 'bun') {
      return bun && bun._id === ingredient._id ? 2 : 0;
    }
    return constructorIngredients.filter(item => item._id === ingredient._id).length;
  };

  if (loading && ingredients.length === 0) {
    return <div className={styles.loading}>Загрузка ингредиентов...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка загрузки: {error}</div>;
  }

  return (
    <section className={styles.section}>
      <h1 className="text text_type_main-large mb-5">Соберите бургер</h1>
      
      <div className={`${styles.tabs} mb-10`}>
        <Tab value="bun" active={currentTab === 'bun'} onClick={() => handleTabClick('bun')}>
          Булки
        </Tab>
        <Tab value="sauce" active={currentTab === 'sauce'} onClick={() => handleTabClick('sauce')}>
          Соусы
        </Tab>
        <Tab value="main" active={currentTab === 'main'} onClick={() => handleTabClick('main')}>
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

      {currentIngredient && (
        <Modal title="Детали ингредиента" onClose={closeModal}>
          <IngredientDetails ingredient={currentIngredient} />
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
      {count > 0 && <Counter count={count} size="default" />}
      <img src={ingredient.image} alt={ingredient.name} className={styles.image} />
      <div className={`${styles.price} mt-1 mb-1`}>
        <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`text text_type_main-default ${styles.name}`}>{ingredient.name}</p>
    </div>
  );
};