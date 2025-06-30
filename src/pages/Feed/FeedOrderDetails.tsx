import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { selectOrderByNumber, selectCurrentOrder } from '../../services/selectors/ordersSelectors';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';
import { ProfileOrderDetails } from '../../components/order-info/ProfileOrderDetails'; // Изменен импорт
import { IIngredient, IOrder, IOrderWithIngredients } from '../../utils/types';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';
import Loader from '../../components/loader/loader';

export const FeedOrderDetails: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? parseInt(number) : 0;
  const order = useAppSelector(state => selectOrderByNumber(state, orderNumber));
  const currentOrder = useAppSelector(selectCurrentOrder);
  const ingredients = useAppSelector(selectIngredients);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (orderNumber > 0 && !order) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, order, orderNumber]);

  if (!order && !currentOrder) {
    return <Loader />;
  }

  const orderToDisplay = order || currentOrder;
  
  if (!orderToDisplay) {
    return <div>Заказ не найден</div>;
  }

  const orderIngredients = orderToDisplay.ingredients
    .map(id => ingredients.find(ing => ing._id === id))
    .filter(Boolean) as IIngredient[];

  const totalPrice = orderIngredients.reduce((sum, item) => sum + (item?.price || 0), 0);

  const orderWithIngredients: IOrderWithIngredients = {
    ...orderToDisplay,
    ingredients: orderIngredients,
    totalPrice,
  };

  return <ProfileOrderDetails order={orderWithIngredients} />;
};