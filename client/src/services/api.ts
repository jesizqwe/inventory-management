import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'present' : 'missing');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data?.redirect) {
      window.location.href = response.data.redirect;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, name: string, password: string) =>
    api.post('/auth/register', { email, name, password }),
  getProfile: () => api.get('/auth/me'),
  googleLogin: () => api.get('/auth/google'),
  githubLogin: () => api.get('/auth/github'),
};

export const userApi = {
  getAll: () => api.get('/user/all'),
  getById: (id: number) => api.get(`/user/by-id/${id}`),
  getMe: () => api.get('/user/me'),
  updateProfile: (data: { name?: string; avatarUrl?: string }) =>
    api.patch('/user/me', data),
};

export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  getUser: (id: number) => api.get(`/admin/users/${id}`),
  blockUser: (id: number) => api.post(`/admin/users/${id}/block`),
  unblockUser: (id: number) => api.post(`/admin/users/${id}/unblock`),
  promote: (id: number) => api.post(`/admin/users/${id}/promote`),
  demote: (id: number) => api.post(`/admin/users/${id}/demote`),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
};

export const inventoryApi = {
  getAll: (params?: { search?: string; category?: string; tag?: string; page?: number; limit?: number }) =>
    api.get('/inventory', { params }),
  getById: (id: number) => api.get(`/inventory/${id}`),
  create: (data: any) => api.post('/inventory', data),
  update: (id: number, data: any) => api.patch(`/inventory/${id}`, data),
  delete: (id: number) => api.delete(`/inventory/${id}`),
  getRecent: (limit?: number) => api.get('/inventory/recent', { params: { limit } }),
  getTop: (limit?: number) => api.get('/inventory/top', { params: { limit } }),
  getStatistics: (id: number) => api.get(`/inventory/${id}/statistics`),
  addAccess: (id: number, email: string) => api.post(`/inventory/${id}/access`, { email }),
  removeAccess: (id: number, userId: number) => api.delete(`/inventory/${id}/access/${userId}`),
};

export const itemApi = {
  getByInventory: (inventoryId: number) => api.get(`/item/inventory/${inventoryId}`),
  getById: (id: number) => api.get(`/item/${id}`),
  create: (inventoryId: number, data: any) => api.post(`/item/inventory/${inventoryId}`, data),
  update: (id: number, data: any) => api.patch(`/item/${id}`, data),
  delete: (id: number) => api.delete(`/item/${id}`),
  getOwnedByUser: (userId: number, page?: number, limit?: number) =>
    api.get(`/item/user/${userId}/owned`, { params: { page, limit } }),
  getWithWriteAccess: (userId: number, page?: number, limit?: number) =>
    api.get(`/item/user/${userId}/write-access`, { params: { page, limit } }),
};

export const commentApi = {
  getByInventory: (inventoryId: number) => api.get(`/comment/inventory/${inventoryId}`),
  getByItem: (itemId: number) => api.get(`/comment/item/${itemId}`),
  createForInventory: (inventoryId: number, text: string) =>
    api.post(`/comment/inventory/${inventoryId}`, { text }),
  createForItem: (itemId: number, text: string) =>
    api.post(`/comment/item/${itemId}`, { text }),
  delete: (id: number) => api.delete(`/comment/${id}`),
};

export const likeApi = {
  toggle: (itemId: number) => api.post(`/like/item/${itemId}`),
  getCount: (itemId: number) => api.get(`/like/item/${itemId}/count`),
  getStatus: (itemId: number) => api.get(`/like/item/${itemId}/status`),
};

export const tagApi = {
  getAll: () => api.get('/tag'),
  autocomplete: (query: string, limit?: number) =>
    api.get('/tag/autocomplete', { params: { q: query, limit } }),
  getCloud: () => api.get('/tag/cloud'),
  create: (name: string) => api.post('/tag', { name }),
};

export const searchApi = {
  search: (query: string, params?: { page?: number; limit?: number; type?: string; tag?: string }) =>
    api.get('/search', { params: { q: query, ...params } }),
  inInventory: (inventoryId: number, query: string) =>
    api.get(`/search/inventory/${inventoryId}`, { params: { q: query } }),
};

export const fileApi = {
  getUploadUrl: (fileType: string, fileName: string) =>
    api.get('/file/upload-url', { params: { type: fileType, name: fileName } }),
  validateUrl: (url: string) => api.get('/file/validate-url', { params: { url } }),
};

export default api;
