// src/services/colony.service.ts
import axios from 'axios';
import { API_URL, COLONIES_URL } from '../config/api';
import Colony from '../models/Colony';
import api from './api';
import UserColony from '../models/UserColony';

const getColonies = async (): Promise<Colony[]> => {
  const token = localStorage.getItem('token');

  return axios
    .get(`${API_URL}/${COLONIES_URL}`, {
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
  const token = localStorage.getItem('token');

  return axios
    .get(`${API_URL}/${COLONIES_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching colonies", error);
      throw new Error("Error fetching colonies");
    });

};

const createColony = async (colony: Partial<Colony>): Promise<Colony> => {
  const token = localStorage.getItem('token');

  return axios
    .post(`${API_URL}/${COLONIES_URL}`, colony, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating colony", error);
      throw new Error("Error creating colony");
    });
};

const updateColony = async (id: string, colony: Partial<Colony>): Promise<Colony> => {
  const response = await api.put<Colony>(`/colonies/${id}`, colony);
  return response.data;
};

const deleteColony = async (id: string): Promise<void> => {
  await api.delete(`/${COLONIES_URL}/${id}`);
};

const getColoniesByUserId = (uuid: string): Promise<UserColony[]> => {
  const token = localStorage.getItem('token');

  return axios
    .get(`${API_URL}/${COLONIES_URL}/by-userId/${uuid}`, {
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

const updateUserColonies = async (selectedColonies: Colony[], userId: string) => {
  const token = localStorage.getItem('token');

  const selectedIds = selectedColonies
    .map((c) => c.id)
    .filter((id): id is string => id !== undefined); // nos aseguramos que no haya undefined

  return axios.post(`${API_URL}/user-colonies/update`, {
    userId,
    selectedColonyIds: selectedIds,
  },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
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
  updateUserColonies
};

export default ColonyService;
