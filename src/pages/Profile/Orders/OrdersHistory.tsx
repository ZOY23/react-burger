import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../services/store/hooks';
import { OrderCard } from '../../../components/order-card/OrderCard';
import styles from './OrdersHistory.module.css';
import { fetchUserOrders } from '../../../services/slices/orderSlice';
import { selectUserOrders } from '../../../services/selectors/ordersSelectors';
import { selectIngredients } from '../../../services/selectors/ingredientsSelectors';
import { useNavigate, useLocation } from 'react-router-dom';

export const OrdersHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const orders = useAppSelector(selectUserOrders);
  const ingredients = useAppSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleOrderClick = (order: any) => {
    navigate(`/profile/orders/${order.number}`, { state: { background: location } });
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-large mb-5">История заказов</h1>
      <div className={styles.ordersList}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              ingredientsData={ingredients}
              showStatus={true}
              onClick={handleOrderClick}
            />
          ))
        ) : (
          <p className="text text_type_main-default">
            У вас пока нет заказов
          </p>
        )}
      </div>
    </div>
  );
};