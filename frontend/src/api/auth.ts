import { apiClient } from './client';

export interface AuthUser {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Investigator' | 'Analyst' | string;
  avatar?: string;
  lastLogin?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  fullName: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const persistAuth = (response: AuthResponse) => {
  localStorage.setItem('token', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));
  return response;
};

export const getStoredUser = (): AuthUser | null => {
  const rawUser = localStorage.getItem('user');
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    clearStoredAuth();
    return null;
  }
};

export const authAPI = {
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials) as AuthResponse;
    return persistAuth(response);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', payload) as AuthResponse;
    return persistAuth(response);
  },

  me: async (): Promise<AuthUser> => {
    const response = await apiClient.get('/auth/me') as { user: AuthUser };
    return response.user;
  },
  
  logout: async () => {
    try {
      if (localStorage.getItem('token')) {
        await apiClient.post('/auth/logout');
      }
    } finally {
      clearStoredAuth();
    }
  }
};
