import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../services/store/hooks';
import { selectOrderByNumber } from '../../../services/selectors/ordersSelectors';
import { selectIngredients } from '../../../services/selectors/ingredientsSelectors';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './OrderDetails.module.css';
import { IIngredient } from '../../../utils/types';

export const OrderDetails: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? parseInt(number) : 0;
  const order = useAppSelector(state => selectOrderByNumber(state, orderNumber));
  const ingredients = useAppSelector(selectIngredients);

  if (!order) {
    return <div className={styles.notFound}>Заказ не найден</div>;
  }

  const orderIngredients = order.ingredients
    .map(id => ingredients.find(ing => ing._id === id))
    .filter(Boolean) as IIngredient[];

  const totalPrice = orderIngredients.reduce((sum, item) => sum + item.price, 0);
  const uniqueIngredients = Array.from(new Set(orderIngredients));

  const statusText = {
    done: 'Выполнен',
    pending: 'Готовится',
    created: 'Создан',
  }[order.status];

  return (
    <div className={styles.container}>
      <span className={`text text_type_digits-default ${styles.number}`}>#{order.number}</span>
      <h2 className="text text_type_main-medium mt-10">{order.name}</h2>
      <p className={`text text_type_main-default mt-3 ${styles.status}`}>
        {statusText}
      </p>
      
      <h3 className="text text_type_main-medium mt-15">Состав:</h3>
      <div className={styles.ingredients}>
        {uniqueIngredients.map((ingredient, index) => {
          const count = orderIngredients.filter(i => i._id === ingredient._id).length;
          return (
            <div key={index} className={styles.ingredient}>
              <div className={styles.ingredientInfo}>
                <div className={styles.imageContainer}>
                  <img 
                    src={ingredient.image_mobile} 
                    alt={ingredient.name}
                    className={styles.image}
                  />
                </div>
                <p className={`text text_type_main-default ${styles.name}`}>
                  {ingredient.name}
                </p>
              </div>
              <div className={styles.price}>
                <span className="text text_type_digits-default mr-2">
                  {count} x {ingredient.price}
                </span>
                <CurrencyIcon type="primary" />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={styles.footer}>
        <span className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </span>
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-default mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};