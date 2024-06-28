import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import LogoutButton from '../components/LogoutButton';
import { updateUserProfile, getUserProfile } from '../api/auth';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      setName(profile.name);
      setLastname(profile.lastname);
      setEmail(profile.email);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedData = { name, lastname, email, password };
      await updateUserProfile(updatedData);
      Alert.alert('Success', 'Profile updated successfully');
      fetchUserProfile();
      navigation.navigate('Quejas'); // Redirigir a la pantalla "Quejas"
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <Input
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Input
        placeholder="Lastname"
        value={lastname}
        onChangeText={setLastname}
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
      <View style={styles.spacer}></View>
      <LogoutButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  spacer: {
    height: 10,
  },
});

export default ProfileScreen;
