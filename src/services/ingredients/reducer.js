import {
    GET_INGREDIENTS_REQUEST,
    GET_INGREDIENTS_SUCCESS,
    GET_INGREDIENTS_FAILED,
    INCREMENT_INGREDIENT_COUNT,
    DECREMENT_INGREDIENT_COUNT,
    RESET_INGREDIENTS_COUNT,
  } from './types';
  
  const initialState = {
    items: [],
    loading: false,
    error: false,
  };
  
  export const ingredientsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_INGREDIENTS_REQUEST:
        return { ...state, loading: true, error: false };
      case GET_INGREDIENTS_SUCCESS:
        return { ...state, items: action.payload, loading: false };
      case GET_INGREDIENTS_FAILED:
        return { ...state, loading: false, error: true };
      case INCREMENT_INGREDIENT_COUNT:
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload ? { ...item, count: item.count + 1 } : item
          ),
        };
      case DECREMENT_INGREDIENT_COUNT:
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload ? { ...item, count: Math.max(0, item.count - 1) } : item
          ),
        };
      case RESET_INGREDIENTS_COUNT:
        return {
          ...state,
          items: state.items.map(item => ({ ...item, count: 0 })),
        };
      default:
        return state;
    }
  };