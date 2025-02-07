export const ADMIN_BASE_URL = process.env.REACT_APP_ADMIN_BASE_URL;
export const USER_BASE_URL = process.env.REACT_APP_USER_BASE_URL;
export const EVENT_BASE_URL = process.env.REACT_APP_EVENT_BASE_URL;
export const MAP_BASE_URL = process.env.REACT_APP_MAP_BASE_URL;
export const CHAT_BASE_URL = process.env.REACT_APP_CHAT_BASE_URL;
export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const WEBSOCKET_BASE_URL = process.env.REACT_APP_WEBSOCKET_BASE_URL || '127.0.0.1:8000';
export const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
