import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Quejas');

  const login = async (token) => {
    setUserToken(token);
    await AsyncStorage.setItem('access_token', token);
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem('access_token');
  };

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        setUserToken(token);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, userToken, isLoading, activeTab, setActiveTab }}>
      {children}
    </AuthContext.Provider>
  );
};
