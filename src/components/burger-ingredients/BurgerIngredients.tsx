import React, { useEffect, useState, useRef } from 'react';
import { Tab, Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerIngredients.module.css';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { fetchIngredients, setCurrentIngredient } from '../../services/slices/ingredientsSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { IIngredient } from '../../utils/types';

export const BurgerIngredients = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState<'bun' | 'sauce' | 'main'>('bun');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<{
    bun: HTMLElement | null;
    sauce: HTMLElement | null;
    main: HTMLElement | null;
  }>({
    bun: null,
    sauce: null,
    main: null
  });

  // Получаем данные из хранилища
  const { 
    items: ingredients, 
    loading, 
    error 
  } = useAppSelector(state => state.ingredients);

  const { 
    bun: constructorBun, 
    ingredients: constructorIngredients 
  } = useAppSelector(state => state.burgerConstructor);

  // Загружаем ингредиенты при монтировании компонента
  useEffect(() => {
    if (ingredients.length === 0 && !loading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, loading]);

  // Обработчик скролла для табов
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;

      let closestSection: 'bun' | 'sauce' | 'main' | null = null;
      let smallestDistance = Infinity;

      (Object.entries(sectionsRef.current) as [keyof typeof sectionsRef.current, HTMLElement | null][])
        .forEach(([type, section]) => {
          if (section) {
            const sectionRect = section.getBoundingClientRect();
            const distance = Math.abs(sectionRect.top - containerTop);

            if (distance < smallestDistance) {
              smallestDistance = distance;
              closestSection = type;
            }
          }
        });

      if (closestSection && closestSection !== currentTab) {
        setCurrentTab(closestSection);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentTab]);

  // Группируем ингредиенты по типам
  const ingredientsByType = {
    bun: ingredients.filter((item: IIngredient) => item.type === 'bun'),
    sauce: ingredients.filter((item: IIngredient) => item.type === 'sauce'),
    main: ingredients.filter((item: IIngredient) => item.type === 'main')
  };

  // Обработчик клика по табу
  const handleTabClick = (tab: 'bun' | 'sauce' | 'main') => {
    setCurrentTab(tab);
    const section = sectionsRef.current[tab];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Обработчик клика по ингредиенту
  const handleIngredientClick = (ingredient: IIngredient) => {
    dispatch(setCurrentIngredient(ingredient));
    navigate(`/ingredients/${ingredient._id}`, { state: { background: location } });
  };

  // Подсчет количества ингредиентов в конструкторе
  const getCount = (ingredient: IIngredient): number => {
    if (ingredient.type === 'bun') {
      return constructorBun && constructorBun._id === ingredient._id ? 2 : 0;
    }
    return constructorIngredients.filter((item: IIngredient) => item._id === ingredient._id).length;
  };

  // Состояния загрузки и ошибки
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

      <div className={styles.ingredientsContainer} ref={containerRef}>
        {(Object.entries(ingredientsByType) as [keyof typeof ingredientsByType, IIngredient[]][])
          .map(([type, items]) => (
            <section 
              key={type} 
              ref={(el: HTMLElement | null) => {
                if (el) {
                  sectionsRef.current[type] = el;
                }
              }}
            >
              <h2 className="text text_type_main-medium mb-6">
                {type === 'bun' ? 'Булки' : type === 'sauce' ? 'Соусы' : 'Начинки'}
              </h2>
              <div className={styles.ingredientsGrid}>
                {items.map((item: IIngredient) => (
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
    </section>
  );
};

// Компонент карточки ингредиента
interface IngredientCardProps {
  ingredient: IIngredient;
  count: number;
  onClick: (ingredient: IIngredient) => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient, count, onClick }) => {
  const [, dragRef] = useDrag({
    type: 'ingredient',
    item: { ingredient },
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      dragRef(ref.current);
    }
  }, [dragRef]);

  return (
    <div 
      ref={ref}
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