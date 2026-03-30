import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username, email, password, role = 'student') =>
    api.post('/users/', { username, email, password, password2: password, role }),
  
  login: async (username, password) => {
    const response = await api.post('/dj-rest-auth/login/', { username, password });
    localStorage.setItem('auth_token', response.data.key);
    return response.data;
  },
  
  logout: () => api.post('/dj-rest-auth/logout/'),
  
  getProfile: () => api.get('/users/me/'),
};

export const activityAPI = {
  list: () => api.get('/activities/'),
  create: (data) => api.post('/activities/', data),
  update: (id, data) => api.put(`/activities/${id}/`, data),
  delete: (id) => api.delete(`/activities/${id}/`),
  getStats: () => api.get('/activities/stats/'),
};

export const teamAPI = {
  list: () => api.get('/teams/'),
  create: (data) => api.post('/teams/', data),
  update: (id, data) => api.put(`/teams/${id}/`, data),
  delete: (id) => api.delete(`/teams/${id}/`),
  join: (id) => api.post(`/teams/${id}/join/`),
  leave: (id) => api.post(`/teams/${id}/leave/`),
  getMembers: (id) => api.get(`/teams/${id}/members/`),
  getStats: (id) => api.get(`/teams/${id}/stats/`),
};

export const workoutAPI = {
  list: () => api.get('/workouts/'),
  getRecommendations: () => api.get('/recommendations/'),
  completeRecommendation: (id, feedback = '') =>
    api.post(`/recommendations/${id}/complete/`, { feedback }),
};

export const leaderboardAPI = {
  getIndividual: (metric = 'calories', period = 'weekly') =>
    api.get('/leaderboards/', { params: { leaderboard_type: 'individual', metric, period } }),
  
  getTeam: (metric = 'calories', period = 'weekly') =>
    api.get('/leaderboards/', { params: { leaderboard_type: 'team', metric, period } }),
};

export default api;
