// src/pages/Feed/Feed.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { OrderCard } from '../../components/order-card/OrderCard';
import styles from './Feed.module.css';
import { connect, disconnect } from '../../services/slices/orderSlice';
import { selectFeed, selectTotalOrders, selectTotalToday } from '../../services/selectors/ordersSelectors';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';
import { useNavigate, useLocation } from 'react-router-dom';
import { IOrder } from '../../utils/types';

export const Feed = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const orders = useAppSelector(selectFeed);
  const ingredients = useAppSelector(selectIngredients);
  const total = useAppSelector(selectTotalOrders);
  const totalToday = useAppSelector(selectTotalToday);

  useEffect(() => {
    dispatch(connect());

    return () => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  const handleOrderClick = (order: IOrder) => {
    navigate(`/feed/${order.number}`, { state: { background: location } });
  };

  const recentOrders = [...orders].reverse();
  const readyOrders = recentOrders.filter(order => order.status === 'done').slice(0, 10);
  const inProgressOrders = recentOrders.filter(order => order.status !== 'done').slice(0, 10);

  return (
    <div className={styles.feed}>
      <h1 className={styles.title}>Лента заказов</h1>
      
      <div className={styles.content}>
        <div className={styles.ordersList}>
          {recentOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              ingredientsData={ingredients}
              showStatus={false}
              onClick={handleOrderClick}
            />
          ))}
        </div>
        
        <div className={styles.stats}>
          <div className={styles.ordersStatus}>
            <div className={styles.ready}>
              <h3 className={styles.statusTitle}>Готовы:</h3>
              <div className={styles.numbersGrid}>
                {readyOrders.map(order => (
                  <span key={order._id} className={styles.doneNumber}>
                    #{order.number}
                  </span>
                ))}
              </div>
            </div>
            
            <div className={styles.inWork}>
              <h3 className={styles.statusTitle}>В работе:</h3>
              <div className={styles.numbersGrid}>
                {inProgressOrders.map(order => (
                  <span key={order._id} className={styles.number}>
                    #{order.number}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.total}>
            <h3 className={styles.totalTitle}>Выполнено за все время:</h3>
            <p className={styles.totalNumber}>{total}</p>
          </div>
          
          <div className={styles.total}>
            <h3 className={styles.totalTitle}>Выполнено за сегодня:</h3>
            <p className={styles.totalNumber}>{totalToday}</p>
          </div>
        </div>
      </div>
    </div>
  );
};