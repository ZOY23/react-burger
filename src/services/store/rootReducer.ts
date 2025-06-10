import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorReducer from '../slices/constructorSlice';
import { IIngredient, IUser} from '../../utils/types';


// Тип для всего состояния хранилища
export interface RootState {
  auth: {
    isAuth: boolean;
    user: IUser | null;
    isLoading: boolean;
    error: string | null;
  };
  ingredients: {
    items: IIngredient[];
    loading: boolean;
    error: string | null;
    currentIngredient: IIngredient | null;
  };
  burgerConstructor: {
    bun: IIngredient | null;
    ingredients: IIngredient[];
    orderNumber: number | null;
    orderLoading: boolean;
    orderError: string | null;
  };
}

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
});

export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;