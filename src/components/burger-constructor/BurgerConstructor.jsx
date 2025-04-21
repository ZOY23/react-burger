import React, { useState } from 'react';
import { 
  ConstructorElement, 
  Button, 
  CurrencyIcon,
  DragIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import { OrderDetails } from '../order-details/order-details';
import { Modal } from '../modal/modal';
import PropTypes from 'prop-types';
import { IngredientType } from '../../utils/types';
import { useDrag, useDrop } from 'react-dnd';

export const BurgerConstructor = ({ ingredients }) => {
  const [selectedBun, setSelectedBun] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const totalPrice = (selectedBun ? selectedBun.price * 2 : 0) + 
    selectedIngredients.reduce((sum, item) => sum + item.price, 0);

  const handleOrderClick = () => {
    setIsOrderModalOpen(true);
  };

  const closeModal = () => {
    setIsOrderModalOpen(false);
  };

  const addIngredient = (ingredient) => {
    if (ingredient.type === 'bun') {
      setSelectedBun(ingredient);
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  return (
    <>
      <section className={styles.constructor}>
        <div className={styles.constructorElements}>
          {selectedBun && (
            <div className={styles.bunTop}>
              <ConstructorElement
                type="top"
                isLocked={true}
                text={`${selectedBun.name} (верх)`}
                price={selectedBun.price}
                thumbnail={selectedBun.image}
              />
            </div>
          )}

          <div className={styles.scrollableIngredients}>
            {selectedIngredients.map((ingredient, index) => (
              <div key={index} className={styles.ingredientItem}>
                <DragIcon type="primary" />
                <ConstructorElement
                  text={ingredient.name}
                  price={ingredient.price}
                  thumbnail={ingredient.image}
                />
              </div>
            ))}
          </div>

          {selectedBun && (
            <div className={styles.bunBottom}>
              <ConstructorElement
                type="bottom"
                isLocked={true}
                text={`${selectedBun.name} (низ)`}
                price={selectedBun.price}
                thumbnail={selectedBun.image}
              />
            </div>
          )}
        </div>

        <div className={styles.orderTotal}>
          <div className={styles.totalPrice}>
            <span className="text text_type_digits-medium">{totalPrice}</span>
            <CurrencyIcon type="primary" />
          </div>
          <Button 
            htmlType="button"  // Добавлен обязательный пропс
            type="primary" 
            size="large"
            onClick={handleOrderClick}
            disabled={!selectedBun}
          >
            Оформить заказ
          </Button>
        </div>
      </section>

      {isOrderModalOpen && (
        <Modal onClose={closeModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(IngredientType).isRequired,
};