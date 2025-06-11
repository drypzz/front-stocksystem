const TOKEN_KEY = 'authToken';

export const login = (token, props) => {
  localStorage.setItem(TOKEN_KEY, token);
  if (props) localStorage.setItem('user', JSON.stringify(props));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};
