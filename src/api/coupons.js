// // import api from "./axios";

// // // GET all coupons
// // export const getCoupons = () => api.get("/coupons");

// // // CREATE coupon
// // export const createCoupon = (data) => api.post("/coupons", data);

// // // UPDATE coupon
// // export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data);

// // // DELETE coupon
// // export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);

// import api from "./axios";

// // =======================
// // COUPONS
// // =======================

// // GET all coupons
// export const getCoupons = () => api.get("/coupons");

// // CREATE coupon
// export const createCoupon = (data) => api.post("/coupons", data);

// // UPDATE coupon
// export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data);

// // DELETE coupon
// export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);

// // =======================
// // CATEGORIES
// // =======================

// // PUBLIC: Get active categories (frontend)
// export const getCategories = () => api.get("/categories");

// // ADMIN: Get all categories
// export const getAdminCategories = () => api.get("/categories/admin/all");

// // ADMIN: Create category
// export const createCategory = (data) => api.post("/categories/admin", data);

// // ADMIN: Update category
// export const updateCategory = (id, data) =>
//   api.put(`/categories/admin/${id}`, data);

// // ADMIN: Delete category
// export const deleteCategory = (id) => api.delete(`/categories/admin/${id}`);
import api from "./axios";

// =======================
// COUPONS
// =======================

// GET all coupons
export const getCoupons = () => api.get("/coupons");

// CREATE coupon
export const createCoupon = (data) => api.post("/coupons", data);

// UPDATE coupon
export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data);

// DELETE coupon
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);

// =======================
// CATEGORIES
// =======================

// PUBLIC: Get categories
export const getCategories = () => api.get("/categories");

// ADMIN: Create category
export const createCategory = (data) => api.post("/categories", data);

// ADMIN: Update category
export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data);

// ADMIN: Delete category
export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`);
