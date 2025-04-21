import React from 'react';
import { IIngredient } from '../../utils/types';
import styles from './IngredientDetails.module.css';

interface IngredientDetailsProps {
  ingredient: IIngredient;
}

export const IngredientDetails: React.FC<IngredientDetailsProps> = ({ ingredient }) => {
  return (
    <div className={styles.container}>
            
      <img 
        src={ingredient.image_large} 
        alt={ingredient.name} 
        className={styles.image}
      />
      
      <h3 className={`text text_type_main-medium mt-4 ${styles.name}`}>
        {ingredient.name}
      </h3>
      
      
      <div className={`mt-8 mb-15 ${styles.nutrition}`}>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Калории,ккал</span>
          <span className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.calories}
          </span>
        </div>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Белки, г</span>
          <span className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.proteins}
          </span>
        </div>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Жиры, г</span>
          <span className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.fat}
          </span>
        </div>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">Углеводы, г</span>
          <span className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.carbohydrates}
          </span>
        </div>
      </div>
    </div>
  );
};