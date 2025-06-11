import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorReducer from '../slices/constructorSlice';
import { IIngredient, IUser } from '../../utils/types';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
});

export default rootReducer;