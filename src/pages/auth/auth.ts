export const authService = {
  getToken: () => localStorage.getItem("token"),

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  login: (token: string) => {
    localStorage.setItem("token", token);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
