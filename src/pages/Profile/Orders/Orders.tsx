import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../services/store/hooks';
import { OrderCard } from '../../../components/order-card/OrderCard';
import { 
  selectUserOrders, 
  selectWsConnected, 
  selectWsError,
  selectCurrentOrderNumber,
  selectOrderByNumber
} from '../../../services/selectors/ordersSelectors';
import { 
  connectUser, 
  disconnect, 
  clearWsError,
  setCurrentOrderNumber
} from '../../../services/slices/orderSlice';
import styles from './Orders.module.css';
import { IOrder, IIngredient } from '../../../utils/types';
import { Modal } from '../../../components/modal/modal';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../components/loader/loader';
import { ProfileOrderDetails } from '../../../components/order-info/ProfileOrderDetails';
import ProtectedRouteElement from '../../../components/ProtectedRouteElement/ProtectedRouteElement';

export const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { number } = useParams<{ number?: string }>();
  const orders = useAppSelector(selectUserOrders);
  const wsConnected = useAppSelector(selectWsConnected);
  const wsError = useAppSelector(selectWsError);
  const currentOrderNumber = useAppSelector(selectCurrentOrderNumber);
  const ingredients = useAppSelector(state => state.ingredients.items);
  const currentOrder = useAppSelector(state => selectOrderByNumber(state, currentOrderNumber || 0));

  useEffect(() => {
    if (number) {
      const orderNum = parseInt(number);
      dispatch(setCurrentOrderNumber(orderNum));
    }
  }, [number, dispatch]);

  const handleOrderClick = (orderNumber: number) => {
    dispatch(setCurrentOrderNumber(orderNumber));
    navigate(`/profile/orders/${orderNumber}`, { state: { background: location } });
  };

  const handleErrorClose = () => {
    dispatch(clearWsError());
    dispatch(connectUser());
  };

  useEffect(() => {
    dispatch(connectUser());
    return () => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  if (!wsConnected && !wsError) {
    return <Loader />;
  }

  const orderWithIngredients = currentOrder ? {
    ...currentOrder,
    ingredients: currentOrder.ingredients
      .map(id => ingredients.find(ing => ing._id === id))
      .filter((ing): ing is IIngredient => !!ing),
    totalPrice: currentOrder.ingredients
      .reduce((sum, id) => sum + (ingredients.find(ing => ing._id === id)?.price || 0), 0)
  } : null;

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
              onClick={() => handleOrderClick(order.number)}
            />
          ))
        ) : (
          <p className="text text_type_main-default">
            У вас пока нет заказов
          </p>
        )}
      </div>

      {(location.state?.background || number) && orderWithIngredients && (
        <Modal 
          title="Детали заказа" 
          onClose={() => {
            dispatch(setCurrentOrderNumber(null));
            navigate('/profile/orders');
          }}
        >
          <ProfileOrderDetails order={orderWithIngredients} />
        </Modal>
      )}
    </div>
  );
};

export const ProtectedOrders = () => (
  <ProtectedRouteElement element={<Orders />} />
);