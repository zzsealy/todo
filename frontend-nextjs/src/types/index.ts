// 用户相关类型
export interface User {
  id: number;
  email: string;
  nick_name: string;
}

// 登录请求类型
export interface LoginRequest {
  email: string;
  password: string;
}

// 注册请求类型
export interface RegisterRequest {
  email: string;
  password: string;
  nick_name: string;
}

// API 响应基础类型
export interface ApiResponse<T = any> {
  status_code: number;
  message?: string;
  data?: T;
  token?: string;
}

// 待办事项类型
export interface Todo {
  id: number;
  title: string;
  content: string;
  finish: boolean;
  finish_time?: string;
  create_time: string;
  update_time: string;
}

// 待办列表类型
export interface TodoList {
  id: number;
  title: string;
  expect_finish_date: string;
  create_time: string;
  update_time: string;
  todos: Todo[];
}

// 状态码常量
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
