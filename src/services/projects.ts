import api from '../utils/api';

export interface ProjectsParams {
  page?: number;
  search?: string;
  category?: number;
  status?: string;
  sort?: string;
  is_featured?: boolean;
}

export interface CreateProjectPayload {
  title: string;
  details: string;
  category: number;
  tags: number[];
  total_target: number;
  start_time: string;
  end_time: string;
}

export interface DonatePayload {
  amount: number;
}

// Project endpoints
export const getProjects = (params?: ProjectsParams) => api.get('/projects/', { params });
export const getProject = (id: number) => api.get(`/projects/${id}/`);
export const createProject = (data: CreateProjectPayload) => api.post('/projects/', data);
export const cancelProject = (id: number) => api.post(`/projects/${id}/cancel/`);
export const getFeaturedProjects = () => api.get('/projects/featured/');
export const getTopRatedProjects = () => api.get('/projects/top-rated/');
export const getLatestProjects = () => api.get('/projects/latest/');
export const getSimilarProjects = (id: number) => api.get(`/projects/${id}/similar/`);
export const uploadProjectImage = (id: number, data: FormData) =>
  api.post(`/projects/${id}/images/`, data);
export const deleteProjectImage = (id: number, imgId: number) =>
  api.delete(`/projects/${id}/images/${imgId}/`);

// Category and Tag endpoints
export const getCategories = () => api.get('projects/categories/');
export const getCategoryProjects = (id: number) => api.get(`projects/categories/${id}/projects/`);
export const getTags = () => api.get('projects/tags/');

// Donation endpoint
export const donateToProject = (id: number, data: DonatePayload) =>
  api.post(`/donations/projects/${id}/pay/`, data);
