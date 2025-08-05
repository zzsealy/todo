// API 基础配置
export const API_CONFIG = {
  baseUrl: 'http://127.0.0.1:8005/api',
} as const;

// 状态码
export const statusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  PASS_NOT_EQUAL: 4001,
  EMAIL_EXIST: 4002,
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'todo_token',
  USER: 'todo_user',
} as const;
