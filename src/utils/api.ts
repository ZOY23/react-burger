export const API_URL = 'https://norma.nomoreparties.space/api';

export const createOrderRequest = async (ingredientIds: string[]) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('accessToken') || '',
    },
    body: JSON.stringify({ ingredients: ingredientIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) throw new Error('API request was not successful');

  return data;
};