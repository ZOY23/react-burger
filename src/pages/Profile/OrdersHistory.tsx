import React from 'react';
import styles from './OrdersHistory.module.css';

export const OrdersHistory: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mb-5">История заказов</h1>
      <div className={styles.ordersList}>
        <p className="text text_type_main-default">
          История заказов будет доступна после реализации API
        </p>
      </div>
    </div>
  );
};