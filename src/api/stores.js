// GET all stores (ADMIN)
export const getStores = () => api.get("/admin/stores");

// CREATE store (ADMIN)
export const createStore = (data) => api.post("/admin/stores", data);

// UPDATE store (ADMIN)
export const updateStore = (id, data) => api.put(`/admin/stores/${id}`, data);

// DELETE store (ADMIN)
export const deleteStore = (id) => api.delete(`/admin/stores/${id}`);
