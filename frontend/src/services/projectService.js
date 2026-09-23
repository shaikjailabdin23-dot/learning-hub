import api from './api';
import { initialProjectsList } from '../data/projectData';

const getStoredProjects = () => {
  const stored = localStorage.getItem('hub_student_projects');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return initialProjectsList;
    }
  }
  localStorage.setItem('hub_student_projects', JSON.stringify(initialProjectsList));
  return initialProjectsList;
};

export const getProjects = async (params = {}) => {
  try {
    const response = await api.get('/projects', { params });
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data.data;
    }
    return getStoredProjects();
  } catch (error) {
    console.warn('[ProjectService] Using local fallback projects:', error.message);
    let list = getStoredProjects();
    if (params.category && params.category !== 'All Categories') {
      list = list.filter((p) => p.category === params.category);
    }
    return list;
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data.data;
  } catch (error) {
    const list = getStoredProjects();
    const found = list.find((p) => p._id === id);
    if (found) return found;
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data.data;
  } catch (error) {
    console.warn('[ProjectService] Local project creation fallback:', error.message);
    const list = getStoredProjects();
    const newProj = {
      ...projectData,
      _id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString(),
      user: { name: 'Student' },
    };
    list.unshift(newProj);
    localStorage.setItem('hub_student_projects', JSON.stringify(list));
    return newProj;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data.data;
  } catch (error) {
    console.warn('[ProjectService] Local project update fallback:', error.message);
    const list = getStoredProjects();
    const index = list.findIndex((p) => p._id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...projectData, updatedAt: new Date().toISOString() };
      localStorage.setItem('hub_student_projects', JSON.stringify(list));
      return list[index];
    }
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.warn('[ProjectService] Local project delete fallback:', error.message);
    const list = getStoredProjects();
    const filtered = list.filter((p) => p._id !== id);
    localStorage.setItem('hub_student_projects', JSON.stringify(filtered));
    return { success: true };
  }
};

export default {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
