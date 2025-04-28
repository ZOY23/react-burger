import React, { useState, useRef, useMemo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ConstructorElement, Button, CurrencyIcon, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { OrderDetails } from '../order-details/order-details';
import { Modal } from '../modal/modal';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { 
  incrementIngredientCount,
  decrementIngredientCount,
  resetIngredientsCount 
} from '../../services/ingredients/actions';
import {
  addConstructorItem,
  removeConstructorItem,
  moveConstructorItem,
  setConstructorBun,
  resetConstructor
} from '../../services/constructor/actions';
import { createOrder } from '../../services/order/actions';
import styles from './BurgerConstructor.module.css';

const BurgerConstructor = () => {
  const dispatch = useAppDispatch();
  const { bun, ingredients } = useAppSelector(state => state.burgerConstructor);
  const { orderNumber, orderRequest } = useAppSelector(state => state.order);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const totalPrice = useMemo(() => {
    const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
    const bunPrice = bun ? bun.price * 2 : 0;
    return ingredientsPrice + bunPrice;
  }, [bun, ingredients]);

  const [, dropTarget] = useDrop({
    accept: 'ingredient',
    drop(item) {
      if (item.type === 'bun') {
        dispatch(setConstructorBun(item));
        dispatch(resetIngredientsCount());
        dispatch(incrementIngredientCount(item._id));
      } else {
        const uniqueItem = { ...item, uuid: crypto.randomUUID() };
        dispatch(addConstructorItem(uniqueItem));
        dispatch(incrementIngredientCount(item._id));
      }
    },
  });

  const handleOrderClick = () => {
    const ingredientsIds = [
      bun?._id,
      ...ingredients.map(item => item._id),
      bun?._id
    ].filter(Boolean);
    
    dispatch(createOrder(ingredientsIds));
    setIsOrderModalOpen(true);
  };

  const closeModal = () => {
    setIsOrderModalOpen(false);
    dispatch(resetConstructor());
    dispatch(resetIngredientsCount());
  };

  return (
    <div ref={dropTarget} className={styles.constructor}>
      {/* ... остальная часть компонента ... */}
    </div>
  );
};

export default BurgerConstructor;