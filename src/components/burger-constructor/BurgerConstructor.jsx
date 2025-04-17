import React from 'react';
import { 
  ConstructorElement, 
  Button, 
  CurrencyIcon,
  DragIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import styles from './BurgerConstructor.module.css';
import { IngredientType } from '../../utils/types';

export const BurgerConstructor = ({ ingredients }) => {
  const bun = ingredients.find(item => item.type === 'bun');
  const otherIngredients = ingredients.filter(item => item.type !== 'bun');
  const totalPrice = (bun ? bun.price * 2 : 0) + 
    otherIngredients.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className={styles.constructor}>
      <div className={styles.constructorElements}>
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

      <div className={styles.orderTotal}>
        <div className={styles.totalPrice}>
          <span className={styles.priceText}>{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button 
          type="primary" 
          size="large"
          htmlType="button"
          extraClass={styles.orderButton}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(IngredientType).isRequired,
};