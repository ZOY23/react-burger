import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { setCurrentIngredient, clearCurrentIngredient } from '../../services/slices/ingredientsSlice';
import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';
import styles from './IngredientDetails.module.css';
import { IIngredient } from '../../utils/types';

const IngredientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { items, currentIngredient } = useAppSelector((state) => state.ingredients);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentIngredient && items.length > 0) {
      const ingredient = items.find((item: IIngredient) => item._id === id);
      if (ingredient) {
        dispatch(setCurrentIngredient(ingredient));
      } else {
        navigate('/404', { replace: true });
      }
    }

    return () => {
      dispatch(clearCurrentIngredient());
    };
  }, [id, items, currentIngredient, dispatch, navigate]);

  if (!currentIngredient) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={`text text_type_main-large ${styles.title}`}>Детали ингредиента</h1>
      <IngredientDetails ingredient={currentIngredient} />
    </div>
  );
};

export default IngredientDetailsPage;