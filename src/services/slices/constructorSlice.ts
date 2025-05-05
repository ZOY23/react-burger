import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IIngredient } from '../../utils/types';
import { API_URL } from '../../utils/api';

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

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: ingredientIds }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (!data.success) throw new Error('API request was not successful');
      
      return data.order.number;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<number>) => {
        state.orderNumber = action.payload;
        state.orderLoading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderError = action.payload as string;
        state.orderLoading = false;
      });
  },
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} = constructorSlice.actions;

export const selectTotalPrice = (state: { burgerConstructor: ConstructorState }) => {
  const { bun, ingredients } = state.burgerConstructor;
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
  return bunPrice + ingredientsPrice;
};

export default constructorSlice.reducer;