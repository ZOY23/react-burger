import { combineReducers } from 'redux';
import { ingredientsReducer } from '../ingredients/reducer';
import { constructorReducer } from '../constructor/reducer';
import { orderReducer } from '../order/reducer';
import { modalReducer } from '../modal/reducer';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  modal: modalReducer,
});