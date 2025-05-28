// pages/IngredientDetails/IngredientDetails.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { setCurrentIngredient, clearCurrentIngredient } from '../../services/slices/ingredientsSlice';
import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';
import styles from './IngredientDetails.module.css';

const IngredientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { items, currentIngredient } = useAppSelector((state) => state.ingredients);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentIngredient && items.length > 0) {
      const ingredient = items.find((item) => item._id === id);
      if (ingredient) {
        dispatch(setCurrentIngredient(ingredient));
      } else {
        navigate('/404', { replace: true });
      }
    }
  }, [id, items, currentIngredient, dispatch, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearCurrentIngredient());
    };
  }, [dispatch]);

  if (!currentIngredient) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={`text text_type_main-large ${styles.title}`}>Детали ингредиента</h1>
      <IngredientDetails ingredient={currentIngredient} />
    </div>
  );
};

export default IngredientDetailsPage;