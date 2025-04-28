import React, { useRef, useState, useEffect } from 'react';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Counter } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import { IngredientType } from '../../utils/types';
import styles from './BurgerIngredients.module.css';

const IngredientCard = ({ ingredient }) => {
  const [, dragRef] = useDrag({
    type: 'ingredient',
    item: { ...ingredient },
  });

  return (
    <div 
      ref={dragRef}
      className={styles.card}
    >
      {ingredient.count > 0 && <Counter count={ingredient.count} size="default" />}
      <img src={ingredient.image} alt={ingredient.name} className={styles.image} />
      <div className={`${styles.price} mt-1 mb-1`}>
        <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`text text_type_main-default ${styles.name}`}>{ingredient.name}</p>
    </div>
  );
};

export const BurgerIngredients = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.ingredients);
  const [currentTab, setCurrentTab] = useState('bun');
  const containerRef = useRef(null);
  const bunRef = useRef(null);
  const sauceRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      const bunDistance = Math.abs(bunRef.current.getBoundingClientRect().top - containerTop);
      const sauceDistance = Math.abs(sauceRef.current.getBoundingClientRect().top - containerTop);
      const mainDistance = Math.abs(mainRef.current.getBoundingClientRect().top - containerTop);

      const minDistance = Math.min(bunDistance, sauceDistance, mainDistance);
      
      if (minDistance === bunDistance) setCurrentTab('bun');
      else if (minDistance === sauceDistance) setCurrentTab('sauce');
      else setCurrentTab('main');
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const ingredientsByType = {
    bun: items.filter(item => item.type === 'bun'),
    sauce: items.filter(item => item.type === 'sauce'),
    main: items.filter(item => item.type === 'main'),
  };

  if (loading) {
    return <p className="text text_type_main-default">Загрузка...</p>;
  }

  return (
    <section className={styles.section}>
      <h1 className="text text_type_main-large mb-5">Соберите бургер</h1>
      
      <div className={`${styles.tabs} mb-10`}>
        <Tab value="bun" active={currentTab === 'bun'}>Булки</Tab>
        <Tab value="sauce" active={currentTab === 'sauce'}>Соусы</Tab>
        <Tab value="main" active={currentTab === 'main'}>Начинки</Tab>
      </div>

      <div className={styles.ingredientsContainer} ref={containerRef}>
        {Object.entries(ingredientsByType).map(([type, items]) => (
          <section key={type} id={type} ref={type === 'bun' ? bunRef : type === 'sauce' ? sauceRef : mainRef}>
            <h2 className="text text_type_main-medium mb-6">
              {type === 'bun' ? 'Булки' : type === 'sauce' ? 'Соусы' : 'Начинки'}
            </h2>
            <div className={styles.ingredientsGrid}>
              {items.map((item) => (
                <IngredientCard key={item._id} ingredient={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};