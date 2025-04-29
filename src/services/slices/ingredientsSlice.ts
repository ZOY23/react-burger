import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IIngredient } from '../../utils/types';

interface IngredientsState {
  items: IIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    fetchIngredientsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchIngredientsSuccess(state, action: PayloadAction<IIngredient[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchIngredientsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchIngredientsStart,
  fetchIngredientsSuccess,
  fetchIngredientsFailure,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;