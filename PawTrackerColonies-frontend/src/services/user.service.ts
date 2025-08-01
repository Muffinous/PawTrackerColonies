// src/services/user.service.ts
import axios from 'axios';
import { API_URL } from '../config/api';
import User from '../models/User';
import api from './api';

const UserService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (uid: string): Promise<User> => {
    const response = await api.get<User>(`/users/${uid}`);
    return response.data;
  },

  getUserByUsername: async (username: string): Promise<User> => {
    const token = localStorage.getItem('token');
    console.log("token peticion ", token)
    return axios
      .get(`${API_URL}/users/username/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching username", error);
        throw new Error("Error fetching username");
      });
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    const response = await api.post<User>('/users', user);
    return response.data;
  },

updateUser: async (updates: Partial<User> & { uid: string }): Promise<User> => {
    const token = localStorage.getItem('token');
    console.log("tokennn ", token)
    return axios.put<User>(`${API_URL}/users/update/${updates.uid}`, updates, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error updating user", error);
        throw new Error("Error updating user");
      });
  },

  deleteUser: async (uid: string): Promise<void> => {
    await api.delete(`/users/${uid}`);
  },
};

export default UserService;
