import React from 'react';
import { 
  ConstructorElement, 
  Button, 
  CurrencyIcon,
  DragIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import { OrderDetails } from '../order-details/order-details';
import { Modal } from '../modal/modal';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../../services/store/store';
import { 
  addBun, 
  addIngredient, 
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../../services/slices/constructorSlice';

export const BurgerConstructor = () => {
  const dispatch = useAppDispatch();
  const { bun, ingredients } = useAppSelector(state => state.burgerConstructor);
  const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);

  const [{ isHover }, dropTarget] = useDrop({
    accept: ['ingredient', 'constructorIngredient'],
    drop(item: { ingredient: IIngredient; index?: number }) {
      if (item.ingredient.type === 'bun') {
        dispatch(addBun(item.ingredient));
      } else if (item.index === undefined) {
        dispatch(addIngredient(item.ingredient));
      }
    },
    collect: monitor => ({
      isHover: monitor.isOver(),
    }),
  });

  const totalPrice = (bun ? bun.price * 2 : 0) + 
    ingredients.reduce((sum, item) => sum + item.price, 0);

  const handleOrderClick = () => {
    setIsOrderModalOpen(true);
  };

  const closeModal = () => {
    setIsOrderModalOpen(false);
    dispatch(clearConstructor());
  };

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    dispatch(moveIngredient({ fromIndex: dragIndex, toIndex: hoverIndex }));
  };

  return (
    <section 
      className={`${styles.constructor} ${isHover ? styles.constructorHover : ''}`} 
      ref={dropTarget}
    >
      {/* Остальной код компонента */}
    </section>
  );
};

// Добавляем интерфейс IIngredient в конце файла
interface IIngredient {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
  uuid?: string;
}