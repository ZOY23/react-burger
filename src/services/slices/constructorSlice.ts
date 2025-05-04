import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IIngredient } from '../../utils/types';

interface ConstructorState {
  bun: IIngredient | null;
  ingredients: IIngredient[];
  orderNumber: number | null;
  orderLoading: boolean;
  orderError: string | null;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderNumber: null,
  orderLoading: false,
  orderError: null,
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<IIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<IIngredient>) {
      const ingredientWithId = {
        ...action.payload,
        uniqueId: `${action.payload._id}-${Date.now()}`
      };
      state.ingredients.push(ingredientWithId);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.uniqueId !== action.payload
      );
    },
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedItem);
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
      state.orderNumber = null;
    },
    createOrderStart(state) {
      state.orderLoading = true;
      state.orderError = null;
    },
    createOrderSuccess(state, action: PayloadAction<number>) {
      state.orderNumber = action.payload;
      state.orderLoading = false;
    },
    createOrderFailure(state, action: PayloadAction<string>) {
      state.orderError = action.payload;
      state.orderLoading = false;
    },
  },
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
} = constructorSlice.actions;

export default constructorSlice.reducer;