import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('reslink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const profileAPI = {
  getProfile: () => api.get('/profiles/me'),
  updateProfile: (profileData) => api.put('/profiles/me', profileData),
  getAllResearchers: () => api.get('/profiles/all'),
  getResearcherById: (id) => api.get(`/profiles/${id}`),
};

export const projectAPI = {
  getProjects: () => api.get('/projects'),
  createProject: (projectData) => api.post('/projects', projectData),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  
  // Team
  addTeamMember: (projectId, userId, role) => api.post(`/projects/${projectId}/team`, { user_id: userId, role }),
  removeTeamMember: (projectId, userId) => api.delete(`/projects/${projectId}/team/${userId}`),
  
  // Milestones
  addMilestone: (projectId, milestoneData) => api.post(`/projects/${projectId}/milestones`, milestoneData),
  updateMilestone: (milestoneId, milestoneData) => api.put(`/milestones/${milestoneId}`, milestoneData),
  
  // AI Recommendations & Skill Gap
  getRecommendations: (projectId, missingSkillsOnly = false) => 
    api.post(`/projects/${projectId}/recommendations`, { missing_skills_only: missingSkillsOnly }),
  getSkillGap: (projectId) => api.get(`/projects/${projectId}/skill-gap`),
};

export const publicationAPI = {
  getPublications: (projectId = null) => api.get('/publications', { params: { project_id: projectId } }),
  createPublication: (pubData) => api.post('/publications', pubData),
  updatePublication: (id, pubData) => api.put(`/publications/${id}`, pubData),
  deletePublication: (id) => api.delete(`/publications/${id}`),
};

export const patentAPI = {
  getPatents: (projectId = null) => api.get('/patents', { params: { project_id: projectId } }),
  createPatent: (patentData) => api.post('/patents', patentData),
  updatePatent: (id, patentData) => api.put(`/patents/${id}`, patentData),
  deletePatent: (id) => api.delete(`/patents/${id}`),
};

export const resourceAPI = {
  getResources: (search = '', type = '', domain = '') => 
    api.get('/resources', { params: { search, type, domain } }),
  createResource: (resData) => api.post('/resources', resData),
  updateResource: (id, resData) => api.put(`/resources/${id}`, resData),
  deleteResource: (id) => api.delete(`/resources/${id}`),
};

export default api;
