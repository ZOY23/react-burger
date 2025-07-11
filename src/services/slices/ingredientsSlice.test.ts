import ingredientsReducer, {
  setCurrentIngredient,
  clearCurrentIngredient
} from './ingredientsSlice';
import { fetchIngredients } from '../actions/ingredientsActions';
import { IIngredient } from '../../utils/types';

// Определяем initialState вручную, так как он не экспортируется из slice
const initialState = {
  items: [] as IIngredient[],
  loading: false,
  error: null as string | null,
  currentIngredient: null as IIngredient | null
};

// Полноценный mock ингредиента со всеми обязательными полями
const testIngredient: IIngredient = {
  _id: '1',
  name: 'Test Ingredient',
  type: 'main',
  price: 100,
  image: 'image.jpg',
  image_mobile: 'image-mobile.jpg',
  image_large: 'image-large.jpg',
  calories: 300,
  proteins: 10,
  fat: 5,
  carbohydrates: 40,
  __v: 0
};

describe('ingredients reducer', () => {
  it('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setCurrentIngredient', () => {
    const state = ingredientsReducer(initialState, setCurrentIngredient(testIngredient));
    expect(state.currentIngredient).toEqual(testIngredient);
  });

  it('should handle clearCurrentIngredient', () => {
    const stateWithIngredient = { ...initialState, currentIngredient: testIngredient };
    const state = ingredientsReducer(stateWithIngredient, clearCurrentIngredient());
    expect(state.currentIngredient).toBeNull();
  });

  it('should handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const ingredients = [testIngredient];
    const action = { type: fetchIngredients.fulfilled.type, payload: ingredients };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      items: ingredients,
      loading: false
    });
  });

  it('should handle fetchIngredients.rejected', () => {
    const error = 'Fetch failed';
    const action = { type: fetchIngredients.rejected.type, payload: error };
    const state = ingredientsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error,
      loading: false
    });
  });
});