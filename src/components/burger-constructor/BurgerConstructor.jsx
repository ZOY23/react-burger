import React from 'react';
import { 
  ConstructorElement, 
  Button, 
  CurrencyIcon,
  DragIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import PropTypes from 'prop-types';

export const BurgerConstructor = ({ ingredients }) => {
  // Находим булку
  const bun = ingredients.find(item => item.type === 'bun');
  
  // Фильтруем остальные ингредиенты
  const otherIngredients = ingredients.filter(item => item.type !== 'bun');

  // Вычисляем общую стоимость
  const totalPrice = (bun ? bun.price * 2 : 0) + 
    otherIngredients.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className={`${styles.constructor} mt-25`}>
      <div className={styles.constructorElements}>
        {/* Верхняя булка */}
        {bun && (
          <div className={styles.bunTop}>
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${bun.name} (верх)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          </div>
        )}

        {/* Основные ингредиенты */}
        <div className={styles.ingredientsList}>
          {otherIngredients.map((item, index) => (
            <div key={`${item._id}-${index}`} className={styles.ingredientItem}>
              <DragIcon type="primary" />
              <ConstructorElement
                text={item.name}
                price={item.price}
                thumbnail={item.image}
                isLocked={false}
              />
            </div>
          ))}
        </div>

        {/* Нижняя булка */}
        {bun && (
          <div className={styles.bunBottom}>
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${bun.name} (низ)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          </div>
        )}
      </div>

      {/* Итоговая сумма и кнопка */}
      <div className={styles.orderTotal}>
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button 
          type="primary" 
          size="large"
          htmlType="button"
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};