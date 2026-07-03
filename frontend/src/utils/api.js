import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

export const tripAPI = {
  createTrip: (data) => api.post('/trips', data),
  getTrips: () => api.get('/trips'),
  getTripById: (tripId) => api.get(`/trips/${tripId}`),
  generateItinerary: (tripId) => api.post(`/trips/${tripId}/generate`),
  updateItinerary: (tripId, day, activities) =>
    api.put(`/trips/${tripId}/itinerary`, { day, activities }),
  deleteTrip: (tripId) => api.delete(`/trips/${tripId}`),
};

export default api;
