export const API_URL = 'https://norma.nomoreparties.space/api';

function checkResponse(res: Response) {
  if (!res.ok) {
    return res.json().then(error => {
      throw new Error(error.message || `HTTP error! status: ${res.status}`);
    });
  }
  return res.json().then(data => {
    if (!data.success) throw new Error('API request was not successful');
    return data;
  });
}

function request(endpoint: string, options: RequestInit) {
  return fetch(`${API_URL}${endpoint}`, options).then(checkResponse);
}

export const createOrderRequest = async (ingredientIds: string[]) => {
  return request('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('accessToken') || '',
    },
    body: JSON.stringify({ ingredients: ingredientIds }),
  });
};