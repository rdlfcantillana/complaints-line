import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const USER_API_URL = 'http://localhost:4000/api/user';
const USER_API_URL = 'https://backend-quejas-production.up.railway.app/api/user';

// Función para guardar el token 
export const setToken = async (token) => {
  console.log('save token test');
  AsyncStorage.setItem('access_token', token);
  //console.log(token)
};


// Función para obtener el token desde localStorage
export const getToken = () => {
  return AsyncStorage.getItem('access_token');
};

export const removeToken = () => {
  AsyncStorage.removeItem('access_token');
};
// Crear instancia de Axios con la URL base de la API
const userApi = axios.create({
  baseURL: USER_API_URL,
});

// Interceptor para añadir el token de autorización en cada solicitud
userApi.interceptors.request.use(
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

// Función para iniciar sesión del usuario
export const loginUser = async (ci, password) => {
  try {
    const response = await userApi.post('/login-ciudadano', { ci, password }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { token, roles } = response.data;

    if (roles && roles.includes('ciudadano')) {
      await setToken(token); // Guardar el token después de verificar el rol
      return response.data;
    } else {
      throw new Error('Only ciudadanos can log in.');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (userData) => {
  try {
    const response = await userApi.post('/register-ciudadano', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};


export const getUserProfile = async (userData) => {
  try {
    const response = await userApi.get('/profile', {
      headers: {
        'Authorization': `Bearer ${AsyncStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};




export const updateUserProfile = async (userData) => {
  try {
    const response = await userApi.put('/profile', userData, {
      headers: {
        'Authorization': `Bearer ${AsyncStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};



// Función para cerrar sesión del usuario

export const logout = async (navigation) => {
  
    await userApi.post(`/logout`, {
      headers: {
        'Authorization': AsyncStorage.getItem('access_token'),
      },
    });
    AsyncStorage.removeItem('access_token');
      
};

export const sendResetPasswordEmail = async (email) => {
  try {
    const response = await userApi.post('/forgot-password', { email: email }, {
      headers: {
        'Content-Type': 'application/json',
        // 'source': 'react-native',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
};



