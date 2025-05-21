import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorReducer from '../slices/constructorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;