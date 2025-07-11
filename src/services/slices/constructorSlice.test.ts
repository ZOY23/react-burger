import constructorReducer, { 
  addBun, 
  addIngredient, 
  removeIngredient, 
  moveIngredient, 
  clearConstructor,
  resetOrderStatus
} from './constructorSlice';
import { createOrder } from './constructorSlice';
import { IIngredient } from '../../utils/types';

// Полноценный initialState с явным типизированием
const initialState = {
  bun: null as IIngredient | null,
  ingredients: [] as Array<IIngredient & { uniqueId: string }>,
  orderNumber: null as number | null,
  orderLoading: false,
  orderError: null as string | null,
};

// Полные mock данные с учетом всех полей IIngredient
const testBun: IIngredient = {
  _id: '1',
  name: 'Test Bun',
  type: 'bun',
  price: 100,
  image: 'image',
  image_mobile: 'image_mobile',
  image_large: 'image_large',
  calories: 300,
  proteins: 10,
  fat: 5,
  carbohydrates: 40,
  __v: 0
};

const testIngredient: IIngredient = {
  _id: '2',
  name: 'Test Ingredient',
  type: 'main',
  price: 50,
  image: 'image',
  image_mobile: 'image_mobile',
  image_large: 'image_large',
  calories: 200,
  proteins: 5,
  fat: 3,
  carbohydrates: 30,
  __v: 0
};

describe('constructor reducer', () => {
  it('should return initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addBun', () => {
    const state = constructorReducer(initialState, addBun(testBun));
    expect(state.bun).toEqual(testBun);
    expect(state.ingredients).toEqual([]);
  });

  it('should handle addIngredient', () => {
    const state = constructorReducer(initialState, addIngredient(testIngredient));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({
      ...testIngredient,
      uniqueId: expect.any(String)
    });
  });

  it('should handle removeIngredient with valid uniqueId', () => {
    const addAction = addIngredient(testIngredient);
    let state = constructorReducer(initialState, addAction);
    
    // Убеждаемся, что uniqueId существует
    const uniqueId = state.ingredients[0]?.uniqueId;
    expect(uniqueId).toBeDefined();
    
    state = constructorReducer(state, removeIngredient(uniqueId!));
    expect(state.ingredients).toHaveLength(0);
  });

  it('should handle moveIngredient', () => {
    const ingredient1 = { ...testIngredient, _id: '2' };
    const ingredient2 = { ...testIngredient, _id: '3' };
    let state = constructorReducer(initialState, addIngredient(ingredient1));
    state = constructorReducer(state, addIngredient(ingredient2));
    
    expect(state.ingredients[0]._id).toBe('2');
    expect(state.ingredients[1]._id).toBe('3');
    
    state = constructorReducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }));
    expect(state.ingredients[0]._id).toBe('3');
    expect(state.ingredients[1]._id).toBe('2');
  });

  it('should handle clearConstructor', () => {
    let state = constructorReducer(initialState, addBun(testBun));
    state = constructorReducer(state, addIngredient(testIngredient));
    state = constructorReducer(state, clearConstructor());
    expect(state).toEqual(initialState);
  });

  it('should handle resetOrderStatus', () => {
    const stateWithOrder = {
      ...initialState,
      orderNumber: 12345,
      orderError: 'Some error'
    };
    const state = constructorReducer(stateWithOrder, resetOrderStatus());
    expect(state.orderNumber).toBeNull();
    expect(state.orderError).toBeNull();
  });

  it('should handle createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const state = constructorReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      orderLoading: true,
      orderError: null
    });
  });

  it('should handle createOrder.fulfilled', () => {
    const orderNumber = 12345;
    const action = { type: createOrder.fulfilled.type, payload: orderNumber };
    const state = constructorReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      orderNumber,
      orderLoading: false
    });
  });

  it('should handle createOrder.rejected', () => {
    const error = 'Order failed';
    const action = { type: createOrder.rejected.type, payload: error };
    const state = constructorReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      orderError: error,
      orderLoading: false
    });
  });
});