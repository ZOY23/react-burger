import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorReducer from '../slices/constructorSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;