import axios from 'axios';
import { API_URL } from '../config/api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface LoginData {
  username: string;
  password: string;
}

const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, data);
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

const AuthService = {
  login,
  logout,
};

export default AuthService;
