// services/selectors/constructorSelectors.ts
import { RootState } from '../store/store';
import { IIngredient } from '../../utils/types';

// Селектор для булки
export const selectConstructorBun = (state: RootState) => 
  state.burgerConstructor.bun;

// Селектор для ингредиентов
export const selectConstructorIngredients = (state: RootState) => 
  state.burgerConstructor.ingredients;

// Селектор для номера заказа
export const selectOrderNumber = (state: RootState) => 
  state.burgerConstructor.orderNumber;

// Селектор для статуса загрузки заказа
export const selectOrderLoading = (state: RootState) => 
  state.burgerConstructor.orderLoading;

// Селектор для ошибки заказа
export const selectOrderError = (state: RootState) => 
  state.burgerConstructor.orderError;

// Селектор для общей стоимости
export const selectTotalPrice = (state: RootState) => {
  const bunPrice = state.burgerConstructor.bun ? 
    state.burgerConstructor.bun.price * 2 : 0;
  
  const ingredientsPrice = state.burgerConstructor.ingredients.reduce(
    (sum: number, item: IIngredient) => sum + item.price, 
    0
  );
  
  return bunPrice + ingredientsPrice;
};

// Селектор для списка id ингредиентов заказа
export const selectOrderIngredients = (state: RootState) => {
  const ingredients = state.burgerConstructor.ingredients.map(item => item._id);
  const bun = state.burgerConstructor.bun?._id;
  return bun ? [bun, ...ingredients, bun] : ingredients;
};