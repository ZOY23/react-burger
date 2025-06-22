import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../services/store/hooks';
import { OrderCard } from '../../../components/order-card/OrderCard';
import styles from './OrdersHistory.module.css';
import { fetchUserOrders } from '../../../services/slices/orderSlice';
import { selectUserOrders } from '../../../services/selectors/ordersSelectors';
import { selectIngredients } from '../../../services/selectors/ingredientsSelectors';

export const OrdersHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectUserOrders);
  const ingredients = useAppSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleOrderClick = (order: any) => {
    // Обработка клика по заказу
  };

  return (
    <div className={styles.container}>
      <div className={styles.orders}>
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            ingredientsData={ingredients}
            showStatus={true}
            onClick={handleOrderClick}
          />
        ))}
      </div>
    </div>
  );
};