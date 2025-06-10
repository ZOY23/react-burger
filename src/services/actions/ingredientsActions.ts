import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from '../store/store';
import { IIngredient } from '../../utils/types';
import { API_URL } from '../../utils/api';

interface IngredientsResponse {
  success: boolean;
  data: IIngredient[];
}

export const fetchIngredients = createAsyncThunk<IIngredient[]>(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/ingredients`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data: IngredientsResponse = await response.json();
      if (!data.success) throw new Error('API request was not successful');
      
      return data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);