// src/services/slices/orderSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IOrder, IOrdersResponse } from '../../utils/types';
import { fetchWithRefresh, request } from '../../utils/api';

interface OrdersState {
  feed: IOrder[];
  userOrders: IOrder[];
  loading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
  currentOrder: IOrder | null;
  wsConnected: boolean;
}

const initialState: OrdersState = {
  feed: [],
  userOrders: [],
  loading: false,
  error: null,
  total: 0,
  totalToday: 0,
  currentOrder: null,
  wsConnected: false,
};

export const connect = () => ({ type: 'orders/connect' });
export const disconnect = () => ({ type: 'orders/disconnect' });

export const fetchFeed = createAsyncThunk<IOrdersResponse>(
  'orders/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await request('/orders/all');
      return response as IOrdersResponse;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk<IOrder[]>(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchWithRefresh<{orders: IOrder[]}>('/orders');
      return response.orders;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk<IOrder, number>(
  'orders/fetchOrderByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const response = await request(`/orders/${number}`);
      return response.orders[0];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateFeed: (state, action: PayloadAction<{orders: IOrder[]; total: number; totalToday: number}>) => {
      state.feed = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    wsConnectionSuccess: (state) => {
      state.wsConnected = true;
    },
    wsConnectionError: (state) => {
      state.wsConnected = false;
    },
    wsConnectionClosed: (state) => {
      state.wsConnected = false;
    },
    clearOrders: (state) => {
      state.feed = [];
      state.userOrders = [];
      state.total = 0;
      state.totalToday = 0;
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action: PayloadAction<IOrdersResponse>) => {
        state.feed = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.loading = false;
      })
      .addCase(fetchFeed.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<IOrder[]>) => {
        state.userOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action: PayloadAction<IOrder>) => {
        state.currentOrder = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { 
  updateFeed, 
  clearOrders, 
  clearCurrentOrder,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed
} = ordersSlice.actions;
export default ordersSlice.reducer;