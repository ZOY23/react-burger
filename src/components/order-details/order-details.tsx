import React from 'react';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './OrderDetails.module.css';

interface OrderDetailsProps {
  orderNumber: number;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ orderNumber }) => {
  return (
    <div className={styles.container}>
      <p className={`text text_type_digits-large ${styles.orderNumber}`}>
        {orderNumber.toString().padStart(6, '0')}
      </p>
      <p className="text text_type_main-medium mt-8">идентификатор заказа</p>
      
      <div className={`mt-15 mb-15 ${styles.checkIcon}`}>
        <CheckMarkIcon type="primary" />
      </div>
      
      <p className="text text_type_main-default mt-15">
        Ваш заказ начали готовить
      </p>
      <p className="text text_type_main-default text_color_inactive mt-2 mb-15">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};