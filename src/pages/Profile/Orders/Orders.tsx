import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../services/store/hooks';
import { OrderCard } from '../../../components/order-card/OrderCard';
import { 
  selectUserOrders, 
  selectWsConnected, 
  selectWsError 
} from '../../../services/selectors/ordersSelectors';
import { 
  connectUser, 
  disconnect, 
  clearWsError 
} from '../../../services/slices/orderSlice';
import styles from './Orders.module.css';
import { IOrder } from '../../../utils/types';
import { Modal } from '../../../components/modal/modal';

export const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectUserOrders);
  const wsConnected = useAppSelector(selectWsConnected);
  const wsError = useAppSelector(selectWsError);
  const ingredients = useAppSelector(state => state.ingredients.items);

  useEffect(() => {
    dispatch(connectUser());
    return () => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  const handleErrorClose = () => {
    dispatch(clearWsError());
    dispatch(connectUser());
  };

  if (!wsConnected && !wsError) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      {wsError && (
        <Modal onClose={handleErrorClose}>
          <div className={styles.errorModal}>
            <h2 className="text text_type_main-medium mb-4">Ошибка соединения</h2>
            <p className="text text_type_main-default mb-6">{wsError}</p>
            <button 
              onClick={handleErrorClose}
              className={`${styles.button} text text_type_main-default`}
            >
              Попробовать снова
            </button>
          </div>
        </Modal>
      )}
      
      <div className={styles.ordersList}>
        {orders.length > 0 ? (
          orders.map((order: IOrder) => (
            <OrderCard
              key={order._id}
              order={order}
              ingredientsData={ingredients}
              showStatus={true}
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