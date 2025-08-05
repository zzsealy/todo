import axios from 'axios';
import { API_CONFIG } from './constants';
import { getRequestConfig } from './utils';
import type { LoginRequest, RegisterRequest, ApiResponse, User, TodoList } from '@/types';

// 创建 axios 实例
const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
});

// 用户相关 API
export const userApi = {
  // 用户登录
  login: async (data: LoginRequest): Promise<ApiResponse<{ token: string }>> => {
    const response = await api.post('/users/login', data);
    return response.data;
  },

  // 用户注册
  register: async (data: RegisterRequest): Promise<ApiResponse> => {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  // 获取用户信息
  getProfile: async (): Promise<ApiResponse<User>> => {
    const config = getRequestConfig();
    const response = await api.get('/users/profile', config);
    return response.data;
  },
};

// 待办事项相关 API
export const todoApi = {
  // 获取待办列表
  getTodoLists: async (): Promise<ApiResponse<TodoList[]>> => {
    const config = getRequestConfig();
    const response = await api.get('/todo/lists', config);
    return response.data;
  },

  // 获取单个待办列表详情
  getTodoList: async (id: number): Promise<ApiResponse<TodoList>> => {
    const config = getRequestConfig();
    const response = await api.get(`/todo/lists/${id}`, config);
    return response.data;
  },

  // 创建待办列表
  createTodoList: async (data: { title: string; expect_finish_date: string }): Promise<ApiResponse<TodoList>> => {
    const config = getRequestConfig();
    const response = await api.post('/todo/lists', data, config);
    return response.data;
  },

  // 更新待办列表
  updateTodoList: async (id: number, data: { title: string; expect_finish_date: string }): Promise<ApiResponse<TodoList>> => {
    const config = getRequestConfig();
    const response = await api.put(`/todo/lists/${id}`, data, config);
    return response.data;
  },

  // 删除待办列表
  deleteTodoList: async (id: number): Promise<ApiResponse> => {
    const config = getRequestConfig();
    const response = await api.delete(`/todo/lists/${id}`, config);
    return response.data;
  },

  // 创建待办事项
  createTodo: async (listId: number, data: { title: string; content: string }): Promise<ApiResponse> => {
    const config = getRequestConfig();
    const response = await api.post(`/todo/lists/${listId}/todos`, data, config);
    return response.data;
  },

  // 更新待办事项
  updateTodo: async (listId: number, todoId: number, data: { title: string; content: string; finish: boolean }): Promise<ApiResponse> => {
    const config = getRequestConfig();
    const response = await api.put(`/todo/lists/${listId}/todos/${todoId}`, data, config);
    return response.data;
  },

  // 删除待办事项
  deleteTodo: async (listId: number, todoId: number): Promise<ApiResponse> => {
    const config = getRequestConfig();
    const response = await api.delete(`/todo/lists/${listId}/todos/${todoId}`, config);
    return response.data;
  },
};

// 测试 API
export const testApi = {
  ping: async (): Promise<ApiResponse> => {
    const response = await api.get('/ping');
    return response.data;
  },
};
