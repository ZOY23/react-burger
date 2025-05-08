import { RootState } from '../store/store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) => state.ingredients.loading;
export const selectIngredientsError = (state: RootState) => state.ingredients.error;
export const selectCurrentIngredient = (state: RootState) => state.ingredients.currentIngredient;