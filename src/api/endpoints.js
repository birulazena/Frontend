import { CONFIG } from "../config";
const BACKEND_BASE_URL = CONFIG.BACKEND_BASE_URL;

export const API = {
  CARDS: {
    CREATE: (userId) => `${BACKEND_BASE_URL}/api/v1/payment-cards/${userId}`,
    DELETE: (id) => `${BACKEND_BASE_URL}/api/v1/payment-cards/${id}`,
    GET_BY_ID: (id) => `${BACKEND_BASE_URL}/api/v1/payment-cards/${id}`,
    GET_BY_USER_ID: (userId) =>
      `${BACKEND_BASE_URL}/api/v1/payment-cards/user/${userId}`,
    ACTIVATE: (id) => `${BACKEND_BASE_URL}/api/v1/payment-cards/activate/${id}`,
    DEACTIVATE: (id) =>
      `${BACKEND_BASE_URL}/api/v1/payment-cards/deactivate/${id}`,
  },

  USER: {
    GET_BY_ID: (id) => `${BACKEND_BASE_URL}/api/v1/users/${id}`,
    UPDATE: (id) => `${BACKEND_BASE_URL}/api/v1/users/${id}`,
    GET_ALL: `${BACKEND_BASE_URL}/api/v1/users`,
    ACTIVATE: (id) => `${BACKEND_BASE_URL}/api/v1/users/activate/${id}`,
    DEACTIVATE: (id) => `${BACKEND_BASE_URL}/api/v1/users/deactivate/${id}`,
  },

  AUTH: {
    LOGIN: `${BACKEND_BASE_URL}/api/v1/auth/public/login`,
    REGISTER: `${BACKEND_BASE_URL}/api/v1/register`,
    REFRESH: `${BACKEND_BASE_URL}/api/v1/auth/refresh`,
  },

  ITEMS: {
    CREATE: `${BACKEND_BASE_URL}/api/v1/items`,
    UPDATE: (id) => `${BACKEND_BASE_URL}/api/v1/items/${id}`,
    DELETE: (id) => `${BACKEND_BASE_URL}/api/v1/items/${id}`,
    GET_BY_ID: (id) => `${BACKEND_BASE_URL}/api/v1/items/${id}`,
    GET_ALL: `${BACKEND_BASE_URL}/api/v1/items`,
  },

  ORDERS: {
    CREATE: `${BACKEND_BASE_URL}/api/v1/orders`,
    UPDATE: (id) => `${BACKEND_BASE_URL}/api/v1/orders/${id}`,
    GET_BY_USER_ID: (userId) =>
      `${BACKEND_BASE_URL}/api/v1/orders/user/${userId}`,
    GET_BY_ID: (id) => `${BACKEND_BASE_URL}/api/v1/orders/${id}`,
    GET_ALL: `${BACKEND_BASE_URL}/api/v1/orders`,
    DELETE: (id) => `${BACKEND_BASE_URL}/api/v1/orders/${id}`,
  },

  PAYMENTS: {
    CREATE: `${BACKEND_BASE_URL}/api/v1/payments`,
    GET_ALL_BY_FILTER: `${BACKEND_BASE_URL}/api/v1/payments`,
    GET_USER_TOTAL_SUM: (userId) =>
      `${BACKEND_BASE_URL}/api/v1/payments/stats/users/${userId}`,
    GET_GLOBAL_TOTAL_SUM: `${BACKEND_BASE_URL}/api/v1/payments/stats/total`,
  },
};
