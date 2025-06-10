import { RootState } from '../store/store';
import { IIngredient } from '../../utils/types';

export const selectConstructorBun = (state: RootState): IIngredient | null => 
  state.burgerConstructor.bun;

export const selectConstructorIngredients = (state: RootState): IIngredient[] => 
  state.burgerConstructor.ingredients;

export const selectOrderNumber = (state: RootState): number | null => 
  state.burgerConstructor.orderNumber;

export const selectOrderLoading = (state: RootState): boolean => 
  state.burgerConstructor.orderLoading;

export const selectOrderError = (state: RootState): string | null => 
  state.burgerConstructor.orderError;

export const selectTotalPrice = (state: RootState): number => {
  const bunPrice = state.burgerConstructor.bun ? 
    state.burgerConstructor.bun.price * 2 : 0;
  
  const ingredientsPrice = state.burgerConstructor.ingredients.reduce(
    (sum: number, item: IIngredient) => sum + item.price, 
    0
  );
  
  return bunPrice + ingredientsPrice;
};

export const selectOrderIngredients = (state: RootState): string[] => {
  const ingredients = state.burgerConstructor.ingredients.map(item => item._id);
  const bun = state.burgerConstructor.bun?._id;
  return bun ? [bun, ...ingredients, bun] : ingredients;
};