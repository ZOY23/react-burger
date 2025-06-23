import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../services/store/hooks';
import { OrderCard } from '../../../components/order-card/OrderCard';
import { selectUserOrders, selectWsConnected } from '../../../services/selectors/ordersSelectors';
import { connectUser, disconnect } from '../../../services/slices/orderSlice';
import styles from './Profile.module.css';
import { IOrder } from '../../../utils/types'; 


export const Orders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectUserOrders);
  const wsConnected = useAppSelector(selectWsConnected);
  const ingredients = useAppSelector(state => state.ingredients.items);

  useEffect(() => {
    dispatch(connectUser());
    return () => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  if (!wsConnected) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.ordersContainer}>
      {orders.map((order: IOrder) => (
        <OrderCard
              key={order._id}
              order={order}
              showStatus={true} ingredientsData={[]}        />
      ))}
    </div>
  );
};