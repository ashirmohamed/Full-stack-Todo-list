import axios from 'axios';

const todoApi = axios.create({
  baseURL: 'http://localhost:8080/api/todos',
  headers: { 'Content-Type': 'application/json' },
});

export const getTodos = async () => (await todoApi.get('')).data;
export const getTodoById = async (id) => (await todoApi.get(`/${id}`)).data;
export const createTodo = async (todo) => (await todoApi.post('', todo)).data;
export const updateTodo = async (id, todo) => (await todoApi.put(`/${id}`, todo)).data;
export const deleteTodo = async (id) => { await todoApi.delete(`/${id}`); };
export const toggleComplete = async (id) => (await todoApi.put(`/${id}/complete`)).data;
