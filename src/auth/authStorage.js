// const ACCESS_TOKEN_KEY = "admin_access_token";
// const ADMIN_KEY = "admin_profile";

// export const setAuth = ({ accessToken, admin }) => {
//   if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
//   if (admin) localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
// };

// export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

// export const getAdmin = () => {
//   const raw = localStorage.getItem(ADMIN_KEY);
//   if (!raw) return null;
//   try {
//     return JSON.parse(raw);
//   } catch {
//     return null;
//   }
// };

// // export const clearAuth = () => {
// //   localStorage.removeItem(ACCESS_TOKEN_KEY);
// //   localStorage.removeItem(ADMIN_KEY);
// // };
// export const clearAuth = () => {
//   localStorage.removeItem("accessToken");
//   localStorage.removeItem("refreshToken");
// };
const ACCESS_TOKEN_KEY = "admin_access_token";
const ADMIN_KEY = "admin_profile";

export const setAuth = ({ accessToken, admin }) => {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (admin) localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getAdmin = () => {
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
};
