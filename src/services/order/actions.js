import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILED,
    RESET_ORDER,
  } from './types';
  import { API_URL } from '../api';
  
  export const createOrder = (ingredients) => async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST });
    
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        dispatch({
          type: CREATE_ORDER_SUCCESS,
          payload: data.order.number,
        });
      } else {
        dispatch({ type: CREATE_ORDER_FAILED });
      }
    } catch (error) {
      dispatch({ type: CREATE_ORDER_FAILED });
    }
  };
  
  export const resetOrder = () => ({
    type: RESET_ORDER,
  });