import ordersReducer, { 
  updateFeed, 
  wsConnectionSuccess, 
  wsConnectionError, 
  wsConnectionClosed,
  clearCurrentOrder,
  setCurrentOrderNumber,
  clearWsError
} from './orderSlice';
import { IOrder } from '../../utils/types';

// Создаем копию initialState вручную, так как он не экспортируется из slice
const initialState = {
  feed: [] as IOrder[],
  userOrders: [] as IOrder[],
  loading: false,
  error: null as string | null,
  total: 0,
  totalToday: 0,
  currentOrder: null as IOrder | null,
  currentOrderNumber: null as number | null,
  wsConnected: false,
  wsError: null as string | null,
};

const testOrder: IOrder = {
  _id: '1',
  ingredients: ['1', '2'],
  status: 'done',
  name: 'Test Order',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 1
};

describe('orders reducer', () => {
  it('should return initial state', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle updateFeed (all orders)', () => {
    const action = updateFeed({ 
      orders: [testOrder], 
      total: 1, 
      totalToday: 1, 
      isUser: false 
    });
    const state = ordersReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      feed: [testOrder],
      total: 1,
      totalToday: 1
    });
  });

  it('should handle updateFeed (user orders)', () => {
    const action = updateFeed({ 
      orders: [testOrder], 
      total: 1, 
      totalToday: 1, 
      isUser: true 
    });
    const state = ordersReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      userOrders: [testOrder],
      total: 1,
      totalToday: 1
    });
  });

  it('should handle wsConnectionSuccess', () => {
    const state = ordersReducer(initialState, wsConnectionSuccess());
    expect(state).toEqual({
      ...initialState,
      wsConnected: true,
      wsError: null
    });
  });

  it('should handle wsConnectionError', () => {
    const error = 'Connection error';
    const state = ordersReducer(initialState, wsConnectionError(error));
    expect(state).toEqual({
      ...initialState,
      wsConnected: false,
      wsError: error
    });
  });

  it('should handle wsConnectionClosed', () => {
    const state = ordersReducer({ 
      ...initialState, 
      wsConnected: true 
    }, wsConnectionClosed());
    expect(state).toEqual({
      ...initialState,
      wsConnected: false
    });
  });

  it('should handle clearCurrentOrder', () => {
    const stateWithOrder = { 
      ...initialState, 
      currentOrder: testOrder,
      currentOrderNumber: testOrder.number
    };
    const state = ordersReducer(stateWithOrder, clearCurrentOrder());
    expect(state).toEqual({
      ...initialState,
      currentOrder: null,
      currentOrderNumber: null
    });
  });

  it('should handle setCurrentOrderNumber', () => {
    const number = 123;
    const state = ordersReducer(initialState, setCurrentOrderNumber(number));
    expect(state).toEqual({
      ...initialState,
      currentOrderNumber: number
    });
  });

  it('should handle fetchOrderByNumber.fulfilled', () => {
    const action = { 
      type: 'orders/fetchOrderByNumber/fulfilled', 
      payload: testOrder 
    };
    const state = ordersReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      currentOrder: testOrder,
      currentOrderNumber: testOrder.number
    });
  });

  it('should handle fetchUserOrders.fulfilled', () => {
    const action = { 
      type: 'orders/fetchUserOrders/fulfilled', 
      payload: [testOrder] 
    };
    const state = ordersReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      userOrders: [testOrder]
    });
  });
});