/**
 * Auth module types
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}
