import axios from 'axios';

const authApi = axios.create({
  baseURL: 'http://localhost:8080/api/users',
  headers: { 'Content-Type': 'application/json' },
});

export const login = async (credentials) => (await authApi.post('/login', credentials)).data;
export const register = async (user) => (await authApi.post('/register', user)).data;
