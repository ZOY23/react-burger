import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { 
  ConstructorElement, 
  Button, 
  CurrencyIcon,
  DragIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import { OrderDetails } from '../order-details/order-details';
import { Modal } from '../modal/modal';
import { useAppDispatch, useAppSelector } from '../../services/store/store';
import { 
  addBun, 
  addIngredient, 
  removeIngredient,
  moveIngredient,
  clearConstructor,
  createOrder
} from '../../services/slices/constructorSlice';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  selectTotalPrice,
  selectOrderNumber,
  selectOrderLoading,
  selectOrderError
} from '../../services/selectors/constructorSelectors';

export const BurgerConstructor = () => {
  const dispatch = useAppDispatch();
  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients);
  const totalPrice = useAppSelector(selectTotalPrice);
  const orderNumber = useAppSelector(selectOrderNumber);
  const orderLoading = useAppSelector(selectOrderLoading);
  const orderError = useAppSelector(selectOrderError);
  
  const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);

  const [{ isHover }, dropTarget] = useDrop({
    accept: ['ingredient', 'constructorIngredient'],
    drop(item) {
      if (item.ingredient) {
        if (item.ingredient.type === 'bun') {
          dispatch(addBun(item.ingredient));
        } else {
          dispatch(addIngredient(item.ingredient));
        }
      }
    },
    collect: monitor => ({
      isHover: monitor.isOver(),
    }),
  });

  const handleOrderClick = () => {
    if (bun && ingredients.length > 0) {
      const ingredientIds = [
        bun._id,
        ...ingredients.map(ing => ing._id),
        bun._id
      ];
      dispatch(createOrder(ingredientIds))
        .unwrap()
        .then(() => {
          setIsOrderModalOpen(true);
        })
        .catch(() => {
          // Ошибка уже обрабатывается в slice
        });
    }
  };

  const closeModal = () => {
    setIsOrderModalOpen(false);
    dispatch(clearConstructor());
  };

  const moveCard = (dragIndex, hoverIndex) => {
    dispatch(moveIngredient({ fromIndex: dragIndex, toIndex: hoverIndex }));
  };

  return (
    <section 
      className={`${styles.constructor} ${isHover ? styles.constructorHover : ''} pt-25 pl-4`} 
      ref={dropTarget}
      data-testid="burger-constructor"
    >
      {bun && (
        <div className={`${styles.bun} ml-8`}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}
      
      <div className={`${styles.ingredients} custom-scroll`}>
        {ingredients.map((ingredient, index) => (
          <ConstructorIngredient
            key={ingredient.uniqueId}
            ingredient={ingredient}
            index={index}
            moveCard={moveCard}
            onRemove={() => dispatch(removeIngredient(ingredient.uniqueId))}
          />
        ))}
      </div>
      
      {bun && (
        <div className={`${styles.bun} ml-8`}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}
      
      <div className={`${styles.total} mt-10`}>
        <div className={`${styles.price} mr-10`}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button 
          htmlType="button" 
          type="primary" 
          size="large"
          onClick={handleOrderClick}
          disabled={!bun || ingredients.length === 0 || orderLoading}
          data-testid="order-button"
        >
          {orderLoading ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </div>
      
      {orderError && (
        <p className={`text text_type_main-default ${styles.error}`}>
          Ошибка при создании заказа: {orderError}
        </p>
      )}
      
      {isOrderModalOpen && orderNumber && (
        <Modal onClose={closeModal}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
    </section>
  );
};

const ConstructorIngredient = ({ ingredient, index, moveCard, onRemove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'constructorIngredient',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'constructorIngredient',
    hover(item) {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div 
      ref={node => drag(drop(node))} 
      className={`${styles.ingredient} mb-4 ${isDragging ? styles.ingredientDragging : ''}`}
      data-testid={`constructor-ingredient-${ingredient._id}`}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={onRemove}
      />
    </div>
  );
};