import React from 'react';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './OrderInfo.module.css';
import { IIngredient, IOrderWithIngredients } from '../../utils/types';

interface ProfileOrderDetailsProps {
  order: IOrderWithIngredients;
}

export const ProfileOrderDetails: React.FC<ProfileOrderDetailsProps> = ({ order }) => {
  const ingredientsCount = order.ingredients.reduce((acc: Record<string, number>, item) => {
    acc[item._id] = (acc[item._id] || 0) + 1;
    return acc;
  }, {});

  const uniqueIngredients = Object.keys(ingredientsCount).map(id => 
    order.ingredients.find(ing => ing._id === id)
  ).filter(Boolean) as IIngredient[];

  const totalPrice = uniqueIngredients.reduce((sum, ingredient) => {
    return sum + (ingredient.price * ingredientsCount[ingredient._id]);
  }, 0);

  const statusText = {
    done: 'Выполнен',
    pending: 'Готовится',
    created: 'Создан',
  }[order.status];

  return (
    <div className={styles.container}>
      <p className={`text text_type_digits-default ${styles.number}`}>#{order.number}</p>
      <h2 className={`text text_type_main-medium mt-10 ${styles.name}`}>{order.name}</h2>
      <p className={`text text_type_main-default mt-3 ${order.status === 'done' ? styles.done : ''}`}>
        {statusText}
      </p>
      <h3 className={`text text_type_main-medium mt-15 ${styles.title}`}>Состав:</h3>
      <div className={`mt-6 ${styles.ingredientsList}`}>
        {uniqueIngredients.map((ingredient) => (
          <div key={ingredient._id} className={styles.ingredient}>
            <div className={styles.ingredientInfo}>
              <img 
                src={ingredient.image_mobile} 
                alt={ingredient.name}
                className={styles.image}
              />
              <span className={`text text_type_main-default ml-4 ${styles.name}`}>
                {ingredient.name}
              </span>
            </div>
            <div className={styles.price}>
              <span className="text text_type_digits-default mr-2">
                {ingredientsCount[ingredient._id]} x {ingredient.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </div>
        ))}
      </div>
      <div className={`mt-10 ${styles.footer}`}>
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