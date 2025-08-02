import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch photo data by photo_id
const getPhotoData = async (photoId) => {
  const response = await api.get(`/photos/${photoId}/data`, {
    responseType: 'arraybuffer',
  });
  const base64 = btoa(
    new Uint8Array(response.data).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );
  return `data:${response.headers['content-type']};base64,${base64}`;
};

export default { ...api, getPhotoData };