import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v2';

// Create a public axios instance (NO authentication headers at all)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For multipart/form-data requests, we'll handle them individually

// User APIs (ALL PUBLIC - NO TOKEN NEEDED)
export const userRegister = (formData) => {
  return axios.post(`${API_BASE_URL}/users/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const userLogin = (formData) => {
  return axios.post(`${API_BASE_URL}/users/login/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getUserDetail = (userId) => {
  return publicApi.get(`/users/${userId}/`);
};

// File APIs (ALL PUBLIC - NO TOKEN NEEDED)
export const uploadFile = (formData) => {
  return axios.post(`${API_BASE_URL}/uploadfile/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const viewFiles = (email) => {
  console.log('Fetching user files...');
  return publicApi.get(`/view_files/${email}`);
};

export const decryptFile = (fileId) => {
  console.log(`Decrypting file ${fileId}...`);
  return publicApi.get(`/decrypt_file/${fileId}/`);
};

export const viewDecryptedFiles = (email) => {
  console.log('Fetching decrypted files...');
  return publicApi.get(`/view_decrypted_file/${email}/`);
};

export const downloadFile = (fileId) => {
  console.log(`Downloading file ${fileId}...`);
  return publicApi.get(`/download/${fileId}/`, {
    responseType: 'blob',
  });
};

// Cloud APIs (ALL PUBLIC - NO TOKEN NEEDED)
export const cloudLogin = (formData) => {
  return axios.post(`${API_BASE_URL}/cloudlogin/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const viewAllFiles = () => {
  console.log('Fetching all files (cloud)...');
  return publicApi.get('/viewallfiles/');
};

export const viewAllUsers = () => {
  console.log('Fetching all users (cloud)...');
  return publicApi.get('/users/');
};

export const authorizeUser = (userId) => {
  console.log(`Authorizing user ${userId}...`);
  return publicApi.post(`/authorize/${userId}/`);
};

export const unauthorizeUser = (userId) => {
  console.log(`Unauthorizing user ${userId}...`);
  return publicApi.post(`/unauthorize/${userId}/`);
};

// No default export needed since we're using named exports