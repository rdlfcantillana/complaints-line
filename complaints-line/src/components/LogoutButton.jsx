import React from 'react';
import { Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../api/auth';

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Logout successful', 'You have been logged out successfully.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Logout failed', error.message);
    }
  };

  return (
    <Button title="Logout" onPress={handleLogout} />
  );
};

export default LogoutButton;
