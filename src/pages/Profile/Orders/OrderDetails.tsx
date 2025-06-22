import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../services/store/hooks';
import { selectOrderByNumber } from '../../../services/selectors/ordersSelectors';
import { selectUserOrders } from '../../../services/selectors/ordersSelectors';
import { selectIngredients } from '../../../services/selectors/ingredientsSelectors';
import { OrderInfo } from '../../../components/order-info/OrderInfo';
import { IIngredient, IOrder } from '../../../utils/types';
import { IOrderWithIngredients } from '../../../utils/types';

export const OrderDetails = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? parseInt(number) : 0;
  const userOrders = useAppSelector(selectUserOrders);
  const order = userOrders.find(order => order.number === orderNumber);
  const ingredients = useAppSelector(selectIngredients);

  if (!order) {
    return <div>Заказ не найден</div>;
  }

  const orderIngredients = order.ingredients
    .map(id => ingredients.find(ing => ing._id === id))
    .filter(Boolean) as IIngredient[];

  const totalPrice = orderIngredients.reduce((sum, item) => sum + item.price, 0);

  const orderWithIngredients: IOrderWithIngredients = {
    ...order,
    ingredients: orderIngredients,
    totalPrice,
  };

  return <OrderInfo order={orderWithIngredients} />;
};