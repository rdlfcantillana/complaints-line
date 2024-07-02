import axios from 'axios';
import { getToken } from './auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

// const CIUDADANO_API_URL = 'http://localhost:4000/api/ciudadano';

const CIUDADANO_API_URL = 'https://backend-quejas-production.up.railway.app/api/ciudadano';

const ciudadanoApi = axios.create({
  baseURL: CIUDADANO_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': AsyncStorage.getItem('access_token'), 
  }
});


// Interceptor para añadir el token de autorización en cada solicitud
ciudadanoApi.interceptors.request.use(
  async (config) => {
    const token = await getToken(); 
    if (token) {
      config.headers['Authorization'] = token;
      console.log('Token added to headers:', config.headers['Authorization']);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Función para obtener los tipos de quejas
export const getComplaintTypes = async () => {
  try {
    const response = await ciudadanoApi.get('/complaint-types',{
       header:{
        'Authorization': AsyncStorage.getItem('access_token'),
          },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching complaint types:', error);
    throw error;
  }
};

// Función para crear una queja
export const createComplaint = async (complaintData) => {
  try {
    const response = await ciudadanoApi.post('/create-complaint', complaintData, {
      headers: {
        'Authorization': AsyncStorage.getItem('access_token'),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating complaint:', error); // Añadir log para depuración
    throw error;
  }
};


// Función para obtener todas las quejas del usuario
export const getAllComplaints = async () => {
  try {
    const response = await ciudadanoApi.get('/view-complaints');
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

export const getFeedback = async () => {
  try {
    const response = await ciudadanoApi.get('/view-all-complaints', {
      headers: {
        'Authorization': `Bearer ${AsyncStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};


export const getresponse = async () => {
  try {
    const response = await ciudadanoApi.get('/view-responses');
    console.log('API response:', response.data); // Verifica la respuesta de la API
    return response.data;
  } catch (error) {
    console.error('Error fetching responses:', error);
    throw error;
  }
};