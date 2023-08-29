let API_URL = localStorage.getItem('API_URL') as string;
 
export const environment = {
  production: false,
  baseUrl: API_URL,
  baseUrl2: API_URL,
  baseUrl3: API_URL,
  baseUrl4: API_URL,

  token:localStorage.getItem('jwt')
};
