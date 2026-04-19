import api from '../utils/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  mobile_phone: string;
  profile_picture?: File;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  mobile_phone?: string;
  profile_picture?: File;
  birthdate?: string;
  facebook_profile?: string;
  country?: string;
}

export interface DeleteAccountPayload {
  password: string;
}

export interface RefreshTokenPayload {
  refresh: string;
}

export async function registerUser(payload: RegisterPayload) {
  const response = await api.post('/auth/register/', payload);
  return response.data;
}

export async function loginUser(payload: LoginPayload) {
  const response = await api.post('/auth/login/', payload);
  return response.data;
}

export async function logoutUser(payload: RefreshTokenPayload) {
  const response = await api.post('/auth/logout/', payload);
  return response.data;
}

export async function refreshToken(payload: RefreshTokenPayload) {
  const response = await api.post('/auth/token/refresh/', payload);
  return response.data;
}
