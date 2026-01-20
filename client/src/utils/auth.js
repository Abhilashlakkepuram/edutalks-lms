export const getToken = () => {
  return sessionStorage.getItem("token");
};

export const isLoggedIn = () => {
  return !!sessionStorage.getItem("token");
};

export const getUser = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};
