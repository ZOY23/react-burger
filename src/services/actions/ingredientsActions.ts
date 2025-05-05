import { AppDispatch } from '../store/store';
import {
  fetchIngredientsStart,
  fetchIngredientsSuccess,
  fetchIngredientsFailure,
} from '../slices/ingredientsSlice';
import { API_URL } from '../../utils/api';

let isFetching = false;

export const fetchIngredients = () => async (dispatch: AppDispatch) => {
  if (isFetching) return;
  
  try {
    isFetching = true;
    dispatch(fetchIngredientsStart());
    
    const response = await fetch(`${API_URL}/ingredients`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    if (!data.success) throw new Error('API request was not successful');
    
    dispatch(fetchIngredientsSuccess(data.data));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    dispatch(fetchIngredientsFailure(message));
  } finally {
    isFetching = false;
  }
};