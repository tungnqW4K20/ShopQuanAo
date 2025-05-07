import Cookies from 'js-cookie';

const TOKEN_KEY = 'admin_auth_token';
const USER_KEY = 'admin_user_info';

export const setAuthCookies = (token, user) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
  Cookies.set(USER_KEY, JSON.stringify(user), { expires: 1, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
};

export const getAuthToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const getUserInfo = () => {
  const user = Cookies.get(USER_KEY);
  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user info from cookie", error);
    return null;
  }
};

export const removeAuthCookies = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
};