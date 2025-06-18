// src/services/user.service.ts
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
    const response = await api.get<User>(`/users/username/${username}`);
    return response.data;
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    const response = await api.post<User>('/users', user);
    return response.data;
  },

  updateUser: async (uid: string, user: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${uid}`, user);
    return response.data;
  },

  deleteUser: async (uid: string): Promise<void> => {
    await api.delete(`/users/${uid}`);
  },
};

export default UserService;
