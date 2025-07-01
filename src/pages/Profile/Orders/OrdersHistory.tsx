import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../services/store/hooks';
import { OrderCard } from '../../../components/order-card/OrderCard';
import styles from './OrdersHistory.module.css';
import { fetchUserOrders, setCurrentOrderNumber } from '../../../services/slices/orderSlice';
import { selectUserOrders } from '../../../services/selectors/ordersSelectors';
import { selectIngredients, selectIngredientsLoading } from '../../../services/selectors/ingredientsSelectors';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Loader from '../../../components/loader/loader';
import { IOrder } from '../../../utils/types';
import { Modal } from '../../../components/modal/modal';
import { OrderDetails } from './OrderDetails';

export const OrdersHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { number } = useParams<{ number?: string }>();
  const orders = useAppSelector(selectUserOrders);
  const ingredients = useAppSelector(selectIngredients);
  const ingredientsLoading = useAppSelector(selectIngredientsLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
    if (number) {
      dispatch(setCurrentOrderNumber(parseInt(number)));
    }
  }, [dispatch, number]);

  const handleOrderClick = (order: IOrder) => {
    navigate(`/profile/orders/${order.number}`, { state: { background: location } });
  };

  const handleModalClose = () => {
    navigate('/profile/orders', { replace: true });
  };

  if (ingredientsLoading) {
    return <Loader />;
  }

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
              onClick={() => handleOrderClick(order)}
            />
          ))
        ) : (
          <p className="text text_type_main-default">
            У вас пока нет заказов
          </p>
        )}
      </div>

      {(location.state?.background || number) && (
        <Modal 
          title="Детали заказа" 
          onClose={handleModalClose}
        >
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};