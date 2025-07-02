// ingredientsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IIngredient } from '../../utils/types';
import { request } from '../../utils/api';

interface IngredientsState {
  items: IIngredient[];
  loading: boolean;
  error: string | null;
  currentIngredient: IIngredient | null;
}

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
  currentIngredient: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await request('/ingredients');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setCurrentIngredient(state, action: PayloadAction<IIngredient>) {
      state.currentIngredient = action.payload;
    },
    clearCurrentIngredient(state) {
      state.currentIngredient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action: PayloadAction<IIngredient[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setCurrentIngredient, clearCurrentIngredient } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;