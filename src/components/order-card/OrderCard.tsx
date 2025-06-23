import React from 'react';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import { IIngredient, IOrder } from '../../utils/types';
import styles from './OrderCard.module.css';

interface OrderCardProps {
  order: IOrder;
  ingredientsData: IIngredient[];
  showStatus?: boolean;
  onClick?: (order: IOrder) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  ingredientsData, 
  showStatus = false,
  onClick 
}) => {
  const statusText = {
    done: 'Выполнен',
    pending: 'Готовится',
    created: 'Создан',
  }[order.status];

  const orderIngredients = order.ingredients
    .map(id => ingredientsData.find(ing => ing._id === id))
    .filter(Boolean) as IIngredient[];

  const totalPrice = orderIngredients.reduce((sum, item) => sum + item.price, 0);

  const uniqueIngredients = Array.from(new Set(orderIngredients));
  const visibleIngredients = uniqueIngredients.slice(0, 6);
  const hiddenCount = uniqueIngredients.length > 6 ? uniqueIngredients.length - 6 : 0;

  return (
    <div 
      className={`${styles.card} p-6 mb-4`}
      onClick={() => onClick && onClick(order)}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.header}>
        <span className={`text text_type_digits-default ${styles.number}`}>#{order.number}</span>
        <span className={`text text_type_main-default text_color_inactive ${styles.date}`}>
          <FormattedDate date={new Date(order.createdAt)} />
        </span>
      </div>
      
      <h3 className={`text text_type_main-medium mt-6 ${styles.name}`}>{order.name}</h3>
      
      {showStatus && (
        <p className={`text text_type_main-default mt-2 ${styles.status} ${
          order.status === 'done' ? styles.done : ''
        }`}>
          {statusText}
        </p>
      )}
      
      <div className={`mt-6 ${styles.footer}`}>
        <div className={styles.ingredients}>
          {visibleIngredients.map((ingredient, index) => (
            <div key={index} className={styles.ingredient}>
              <img 
                src={ingredient.image_mobile} 
                alt={ingredient.name}
                className={styles.image}
              />
              {index === 5 && hiddenCount > 0 && (
                <span className={`${styles.more} text text_type_main-default`}>
                  +{hiddenCount}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div className={styles.price}>
          <span className="text text_type_digits-default mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};