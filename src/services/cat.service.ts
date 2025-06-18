// src/services/cat.service.ts
import api from './api';
import type { Cat } from '../models/Cat';

export const getCats = async (): Promise<Cat[]> => {
  const response = await api.get<Cat[]>('/cats');
  return response.data;
};

export const getCatById = async (id: string): Promise<Cat> => {
  const response = await api.get<Cat>(`/cats/${id}`);
  return response.data;
};

export const createCat = async (cat: Partial<Cat>): Promise<Cat> => {
  const response = await api.post<Cat>('/cats', cat);
  return response.data;
};

export const updateCat = async (id: string, cat: Partial<Cat>): Promise<Cat> => {
  const response = await api.put<Cat>(`/cats/${id}`, cat);
  return response.data;
};

export const deleteCat = async (id: string): Promise<void> => {
  await api.delete(`/cats/${id}`);
};
