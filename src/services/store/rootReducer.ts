import { combineReducers } from 'redux';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorReducer from '../slices/constructorSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;