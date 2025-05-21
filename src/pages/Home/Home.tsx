import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store/hooks';
import { setCurrentIngredient } from '../../services/slices/ingredientsSlice';
import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';
import { Modal } from '../../components/modal/modal';
import styles from './Home.module.css';
import { IIngredient } from '../../utils/types';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.ingredients);
  const background = location.state?.background;

  const handleIngredientClick = (ingredient: IIngredient) => {
    dispatch(setCurrentIngredient(ingredient));
    navigate(`/ingredients/${ingredient._id}`, { state: { background: location } });
  };

  // Получаем текущий ингредиент из хранилища
  const { currentIngredient } = useAppSelector((state) => state.ingredients);

  return (
    <div className={styles.container}>
      {items.map((ingredient: IIngredient) => (
        <div 
          key={ingredient._id}
          onClick={() => handleIngredientClick(ingredient)}
        >
          {/* Отображение карточки ингредиента */}
        </div>
      ))}

      {background && currentIngredient && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal onClose={() => navigate(-1)}>
                <IngredientDetails ingredient={currentIngredient} />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default Home;