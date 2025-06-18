// src/services/colony.service.ts
import axios from 'axios';
import { API_URL } from '../config/api';
import Colony from '../models/Colony';
import api from './api';

const token = localStorage.getItem('token'); // O donde tengas guardado el token

const getColonies = async (): Promise<Colony[]> => {
  return axios
    .get(`${API_URL}/colonies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching all colonies", error);
      throw new Error("Error fetching all colonies");
    });
};

const getColonyById = async (id: string): Promise<Colony> => {
  const response = await api.get<Colony>(`/colonies/${id}`);
  return response.data;
};

const createColony = async (colony: Partial<Colony>): Promise<Colony> => {
  const response = await api.post<Colony>('/colonies', colony);
  return response.data;
};

const updateColony = async (id: string, colony: Partial<Colony>): Promise<Colony> => {
  const response = await api.put<Colony>(`/colonies/${id}`, colony);
  return response.data;
};

const deleteColony = async (id: string): Promise<void> => {
  await api.delete(`/colonies/${id}`);
};

const getColoniesByUserId = (uuid: string): Promise<Colony[]> => {
  const token = localStorage.getItem('token'); // O donde tengas guardado el token

  return axios
    .get(`${API_URL}/colonies/by-userId/${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching colonies", error);
      throw new Error("Error fetching colonies");
    });
}


// Exportar todo como un único objeto
const ColonyService = {
  getColonies,
  getColonyById,
  createColony,
  updateColony,
  deleteColony,
  getColoniesByUserId,
};

export default ColonyService;
