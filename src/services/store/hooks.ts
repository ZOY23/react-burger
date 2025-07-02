import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { RootState, AppDispatch } from './store';

// Типизированные хуки для работы с Redux
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Дополнительные хуки для приложения
export const useAuth = () => {
  const { isAuth, user, isLoading, error } = useAppSelector(state => state.auth);
  return { isAuth, user, isLoading, error };
};

export const useIngredients = () => {
  const { items, loading, error } = useAppSelector(state => state.ingredients);
  return { ingredients: items, isLoading: loading, error };
};

export const useConstructor = () => {
  const { bun, ingredients, orderNumber, orderLoading, orderError } = 
    useAppSelector(state => state.burgerConstructor);
  return { bun, ingredients, orderNumber, orderLoading, orderError };
};