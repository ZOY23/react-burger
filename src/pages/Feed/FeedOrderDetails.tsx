import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { selectOrderByNumber, selectCurrentOrder } from '../../services/selectors/ordersSelectors';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';
import { OrderInfo } from '../../components/order-info/OrderInfo';
import { IIngredient, IOrder } from '../../utils/types';
import { IOrderWithIngredients } from '../../utils/types';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';

export const FeedOrderDetails = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? parseInt(number) : 0;
  const order = useAppSelector(state => selectOrderByNumber(state, orderNumber));
  const currentOrder = useAppSelector(selectCurrentOrder);
  const ingredients = useAppSelector(selectIngredients);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!order && orderNumber) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, order, orderNumber]);

  const orderToDisplay = order || currentOrder;

  if (!orderToDisplay) {
    return <div>Загрузка заказа...</div>;
  }

  const orderIngredients = orderToDisplay.ingredients
    .map(id => ingredients.find(ing => ing._id === id))
    .filter(Boolean) as IIngredient[];

  const totalPrice = orderIngredients.reduce((sum, item) => sum + item.price, 0);

  const orderWithIngredients: IOrderWithIngredients = {
    ...orderToDisplay,
    ingredients: orderIngredients,
    totalPrice,
  };

  return <OrderInfo order={orderWithIngredients} />;
};