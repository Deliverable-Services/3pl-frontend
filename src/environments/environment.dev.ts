let API_URL = localStorage.getItem('API_URL') as string;
 
export const environment = {
  production: false,
  baseUrl: API_URL,
};
