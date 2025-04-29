import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IIngredient } from '../../utils/types';

interface ConstructorState {
  bun: IIngredient | null;
  ingredients: IIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<IIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<IIngredient>) {
      state.ingredients.push(action.payload);
    },
    removeIngredient(state, action: PayloadAction<number>) {
      state.ingredients.splice(action.payload, 1);
    },
    moveIngredient(state, action: PayloadAction<{fromIndex: number, toIndex: number}>) {
      const {fromIndex, toIndex} = action.payload;
      const [movedItem] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedItem);
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} = constructorSlice.actions;

export default constructorSlice.reducer;