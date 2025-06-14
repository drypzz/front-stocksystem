const TOKEN_KEY = "authToken";
const USER_KEY = "user";

export const login = (token, props) => {
  localStorage.setItem(TOKEN_KEY, token);
  if (props) localStorage.setItem(USER_KEY, JSON.stringify(props));
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};