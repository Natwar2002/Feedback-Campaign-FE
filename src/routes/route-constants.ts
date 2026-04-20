export const ROUTES = {
  // Root
  ROOT: '/',
  AUTH : {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  PROTECTED:{
    ORGANIZATION: '/organization',
  }
} as const;
