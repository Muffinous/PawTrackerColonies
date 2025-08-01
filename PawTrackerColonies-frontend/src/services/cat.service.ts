// src/services/cat.service.ts
import api from './api';
import type { Cat } from '../models/Cat';
import axios from 'axios';
import { API_URL } from '../config/api';

export const getCats = async (): Promise<Cat[]> => {
  const token = localStorage.getItem('token');
  const response = await api.get<Cat[]>(`${API_URL}/cats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCatById = async (id: string): Promise<Cat> => {
  const response = await api.get<Cat>(`/cats/${id}`);
  return response.data;
};

export const createCats = async (cats: Partial<Cat>[]): Promise<Cat[]> => {
  const token = localStorage.getItem('token');

  return await axios.post(`${API_URL}/cats/create`, cats, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateCat = async (id: string, cat: Partial<Cat>): Promise<Cat> => {
  const response = await api.put<Cat>(`/cats/${id}`, cat);
  return response.data;
};

export const deleteCat = async (id: string): Promise<void> => {
  await api.delete(`/cats/${id}`);
};

export const getCatsByColonyId = async (colonyId: string): Promise<Cat[]> => {
  const token = localStorage.getItem('token');

  return axios
    .get(`${API_URL}/cats/colony/${colonyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching colonies", error);
      throw new Error("Error fetching colonies");
    });
};

export const getCatImage = async (filename: string): Promise<string> => {
  const token = localStorage.getItem('token');

  console.log('Fetching cat image:', filename);
  const response = await axios.get(`${API_URL}/cats/images/${filename}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });

  // Crear URL local para el blob recibido
  const imageUrl = URL.createObjectURL(response.data);
  return imageUrl;
};
