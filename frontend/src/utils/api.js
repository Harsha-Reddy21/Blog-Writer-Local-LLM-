import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Blog generation
export const generateBlog = async (data) => {
  const response = await api.post('/generate', data);
  return response.data;
};

// History management
export const getHistory = async (params = {}) => {
  const response = await api.get('/history', { params });
  return response.data;
};

export const getGeneration = async (id) => {
  const response = await api.get(`/history/${id}`);
  return response.data;
};

export const deleteGeneration = async (id) => {
  const response = await api.delete(`/history/${id}`);
  return response.data;
};

// Models and status
export const getModels = async () => {
  const response = await api.get('/models');
  return response.data;
};

export const getStatus = async () => {
  const response = await api.get('/status');
  return response.data;
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api; 