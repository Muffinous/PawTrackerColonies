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
  console.log("reponmse ", response)
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

const validateToken = async (token: string): Promise<any> => {
  try {
    console.log("Validating token: ", token);
    const response = await axios.get(`${API_URL}/auth/validate-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("validateToken response: ", response);
    return response;
  } catch {
    return false;
  }
};

const getCurrentUser = async (token: string) => {
  try {
    console.log("Validating token: ", token);
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("validateToken response: ", response.data);
    return response.data;
  } catch {
    return false;
  }
}


const AuthService = {
  login,
  logout,
  validateToken,
  getCurrentUser
};

export default AuthService;
