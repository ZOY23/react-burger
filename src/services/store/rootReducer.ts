import authReducer from '../slices/authSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorReducer from '../slices/constructorSlice';
import { IIngredient, IUser } from '../../utils/types';
import { combineReducers } from '@reduxjs/toolkit';
import ordersReducer from '../slices/orderSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer,
});


export default rootReducer;