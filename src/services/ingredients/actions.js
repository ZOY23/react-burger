import {
    GET_INGREDIENTS_REQUEST,
    GET_INGREDIENTS_SUCCESS,
    GET_INGREDIENTS_FAILED,
    INCREMENT_INGREDIENT_COUNT,
    DECREMENT_INGREDIENT_COUNT,
    RESET_INGREDIENTS_COUNT,
  } from './types';
  import { API_URL } from '../api';
  
  export const getIngredients = () => async (dispatch) => {
    dispatch({ type: GET_INGREDIENTS_REQUEST });
    
    try {
      const response = await fetch(`${API_URL}/ingredients`);
      const data = await response.json();
      
      if (data.success) {
        dispatch({
          type: GET_INGREDIENTS_SUCCESS,
          payload: data.data.map(item => ({ ...item, count: 0 })),
        });
      } else {
        dispatch({ type: GET_INGREDIENTS_FAILED });
      }
    } catch (error) {
      dispatch({ type: GET_INGREDIENTS_FAILED });
    }
  };
  
  export const incrementIngredientCount = (id) => ({
    type: INCREMENT_INGREDIENT_COUNT,
    payload: id,
  });
  
  export const decrementIngredientCount = (id) => ({
    type: DECREMENT_INGREDIENT_COUNT,
    payload: id,
  });
  
  export const resetIngredientsCount = () => ({
    type: RESET_INGREDIENTS_COUNT,
  });