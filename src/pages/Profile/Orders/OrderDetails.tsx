import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../services/store/hooks';
import { selectOrderByNumber, selectCurrentOrder } from '../../../services/selectors/ordersSelectors';
import { selectIngredients } from '../../../services/selectors/ingredientsSelectors';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './OrderDetails.module.css';
import { IIngredient } from '../../../utils/types';
import { fetchOrderByNumber } from '../../../services/slices/orderSlice';
import Loader from '../../../components/loader/loader';

export const OrderDetails: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = number ? parseInt(number) : 0;
  const order = useAppSelector(state => selectOrderByNumber(state, orderNumber));
  const currentOrder = useAppSelector(selectCurrentOrder);
  const ingredients = useAppSelector(selectIngredients);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (orderNumber && (!order || order.number !== orderNumber)) {
      dispatch(fetchOrderByNumber(orderNumber));
    }

    if (!location.state?.background) {
      navigate('/profile/orders', {
        state: { background: location, orderNumber },
        replace: true
      });
    }
  }, [dispatch, order, orderNumber, navigate, location]);

  const orderToDisplay = order || currentOrder;

  if (!orderToDisplay || !ingredients.length) {
    return <Loader />;
  }

  const orderIngredients = orderToDisplay.ingredients
    .map(id => ingredients.find(ing => ing._id === id))
    .filter(Boolean) as IIngredient[];

  const totalPrice = orderIngredients.reduce((sum, item) => sum + item.price, 0);
  const uniqueIngredients = Array.from(new Set(orderIngredients));

  const statusText = {
    done: 'Выполнен',
    pending: 'Готовится',
    created: 'Создан',
  }[orderToDisplay.status];

  return (
    <div className={styles.container}>
      <span className={`text text_type_digits-default ${styles.number}`}>#{orderToDisplay.number}</span>
      <h2 className="text text_type_main-medium mt-10">{orderToDisplay.name}</h2>
      <p className={`text text_type_main-default mt-3 ${styles.status}`}>
        {statusText}
      </p>
      
      <h3 className="text text_type_main-medium mt-15">Состав:</h3>
      <div className={styles.ingredients}>
        {uniqueIngredients.map((ingredient, index) => {
          const count = orderIngredients.filter(i => i._id === ingredient._id).length;
          return (
            <div key={index} className={styles.ingredient}>
              <div className={styles.ingredientInfo}>
                <div className={styles.imageContainer}>
                  <img 
                    src={ingredient.image_mobile} 
                    alt={ingredient.name}
                    className={styles.image}
                  />
                </div>
                <p className={`text text_type_main-default ${styles.name}`}>
                  {ingredient.name}
                </p>
              </div>
              <div className={styles.price}>
                <span className="text text_type_digits-default mr-2">
                  {count} x {ingredient.price}
                </span>
                <CurrencyIcon type="primary" />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className={styles.footer}>
        <span className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(orderToDisplay.createdAt)} />
        </span>
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-default mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};