import { AppDispatch } from '../store/store';
import {
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
} from '../slices/constructorSlice';
import { API_URL } from '../../utils/api';

export const createOrder = (ingredientIds: string[]) => async (dispatch: AppDispatch) => {
  dispatch(createOrderStart());
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients: ingredientIds }),
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    if (!data.success) throw new Error('API request was not successful');
    
    dispatch(createOrderSuccess(data.order.number));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    dispatch(createOrderFailure(message));
  }
};