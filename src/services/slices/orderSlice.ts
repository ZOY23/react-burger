import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IOrder, IOrdersResponse } from '../../utils/types';
import { fetchWithRefresh, request } from '../../utils/api';
import { RootState } from '../store/store';

interface OrdersState {
  feed: IOrder[];
  userOrders: IOrder[];
  loading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
  currentOrder: IOrder | null;
  currentOrderNumber: number | null;
  wsConnected: boolean;
  wsError: string | null;
}

const initialState: OrdersState = {
  feed: [],
  userOrders: [],
  loading: false,
  error: null,
  total: 0,
  totalToday: 0,
  currentOrder: null,
  currentOrderNumber: null,
  wsConnected: false,
  wsError: null,
};

export const connect = () => ({ type: 'orders/connect' });
export const connectUser = () => ({ type: 'orders/connectUser' });
export const disconnect = () => ({ type: 'orders/disconnect' });

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

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateFeed: (state, action: PayloadAction<{
      orders: IOrder[];
      total: number;
      totalToday: number;
      isUser: boolean;
    }>) => {
      if (action.payload.isUser) {
        state.userOrders = action.payload.orders;
      } else {
        state.feed = action.payload.orders;
      }
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    wsConnectionSuccess: (state) => {
      state.wsConnected = true;
      state.wsError = null;
    },
    wsConnectionError: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.wsError = action.payload;
    },
    wsConnectionClosed: (state) => {
      state.wsConnected = false;
      state.wsError = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.currentOrderNumber = null;
    },
    setCurrentOrderNumber: (state, action: PayloadAction<number | null>) => {
      state.currentOrderNumber = action.payload;
    },
    clearWsError: (state) => {
      state.wsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.currentOrderNumber = action.payload.number;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      });
  },
});

export const { 
  updateFeed,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  clearCurrentOrder,
  setCurrentOrderNumber,
  clearWsError
} = ordersSlice.actions;

export const selectOrdersState = (state: RootState) => state.orders;
export const selectWsConnected = (state: RootState) => state.orders.wsConnected;
export const selectWsError = (state: RootState) => state.orders.wsError;
export const selectCurrentOrderNumber = (state: RootState) => state.orders.currentOrderNumber;

export default ordersSlice.reducer;