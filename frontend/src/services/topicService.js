import api from './api';
import { technicalTopics } from '../data/technicalData';

export const getTopics = async (params = {}) => {
  try {
    const response = await api.get('/topics', { params });
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data.data;
    }
    return filterLocalTopics(technicalTopics, params);
  } catch (error) {
    console.warn('[TopicService] Using local fallback topics:', error.message);
    return filterLocalTopics(technicalTopics, params);
  }
};

export const getTopicById = async (idOrSlug) => {
  try {
    const response = await api.get(`/topics/${idOrSlug}`);
    return response.data.data;
  } catch (error) {
    console.warn('[TopicService] Fallback getTopicById:', error.message);
    const local = technicalTopics.find((t) => t.slug === idOrSlug || t.id === idOrSlug);
    if (local) return { ...local, isCompleted: false };
    throw error;
  }
};

const filterLocalTopics = (topics, { hub, category, search }) => {
  let filtered = [...topics];
  if (hub && hub !== 'all') {
    filtered = filtered.filter((t) => !t.hubSlug || t.hubSlug.toLowerCase() === hub.toLowerCase());
  }
  if (category && category !== 'All') {
    if (category === 'DSA') {
      filtered = filtered.filter(
        (t) => t.category === 'Data Structures & Algorithms' || t.category === 'DSA'
      );
    } else if (category === 'AI & ML') {
      filtered = filtered.filter(
        (t) => t.category === 'AI & Machine Learning' || t.category === 'AI & ML'
      );
    } else if (category === 'Software Engineering') {
      filtered = filtered.filter(
        (t) =>
          t.category.includes('Software') ||
          t.category.includes('Programming') ||
          t.category.includes('Cloud')
      );
    } else {
      filtered = filtered.filter(
        (t) => t.category && t.category.toLowerCase().includes(category.toLowerCase())
      );
    }
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q))
    );
  }
  return filtered;
};

export default {
  getTopics,
  getTopicById,
};
