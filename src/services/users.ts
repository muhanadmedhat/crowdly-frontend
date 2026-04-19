import api from '../utils/api';

// ── Request Payload Types ──────────────────────────────────
export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  mobile_phone?: string;
  profile_picture?: File;
  birthdate?: string;
  facebook_profile?: string;
  country?: string;
  phone?: string; 
}

// ── Response Types ─────────────────────────────────────────
export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  profile_picture: string | null;
  birth_date: string | null;
  facebook_profile: string | null;
  country: string | null;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string | null;
}

// ── Current User Endpoints (UsersView) ────────────────────
// GET    /users/me/   → get my profile
// DELETE /users/me/   → delete my account
// PUT    /users/me/   → fully update my profile
// PATCH  /users/me/   → partially update my profile

export async function getMyProfile() {
  const response = await api.get('/users/me/');
  return response.data;
}

export async function deleteMyAccount() {
  const response = await api.delete('/users/me/');
  return response.data;
}

export async function updateMyProfile(payload: UpdateUserPayload) {
  const response = await api.put('/users/me/', payload);
  return response.data;
}

export async function patchMyProfile(payload: UpdateUserPayload) {
  const response = await api.patch('/users/me/', payload);
  return response.data;
}

// ── Admin Endpoints (AdminsView) ──────────────────────────
// GET    /users/         → list all users (paginated, admin only)
// GET    /users/<id>/    → get a specific user (admin only)
// DELETE /users/<id>/    → delete a specific user (admin only)
// PUT    /users/<id>/    → update a specific user (admin only)

export async function getAllUsers() {
  const response = await api.get('/users/');
  return response.data;
}

export async function getUserById(id: number) {
  const response = await api.get(`/users/${id}/`);
  return response.data;
}

export async function deleteUserById(id: number) {
  const response = await api.delete(`/users/${id}/`);
  return response.data;
}

export async function updateUserById(id: number, payload: UpdateUserPayload) {
  const response = await api.put(`/users/${id}/`, payload);
  return response.data;
}

// ── Current-user project & donation history ───────────────────────────────
export async function getMyProjects() {
  const response = await api.get('/users/me/projects/');
  return response.data;
}

export async function getMyDonations() {
  const response = await api.get('/donations/me/');
  return response.data;
}
