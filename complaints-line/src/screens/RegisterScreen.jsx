// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { registerUser } from '../api/auth';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [ci, setCi] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const userData = {
        name,
        lastname,
        email,
        ci,
        password,
      };
      const response = await registerUser(userData);
      alert(response.message);
      navigation.navigate('Login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Enter your details to create an account.</Text>

      <Input placeholder="Enter your name" value={name} onChangeText={setName} />
      <Input placeholder="Enter your lastname" value={lastname} onChangeText={setLastname} />
      <Input placeholder="Enter your email" value={email} onChangeText={setEmail} />
      <Input placeholder="Enter your CI number" value={ci} onChangeText={setCi} />
      <Input placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />

      <Button title="Register" onPress={handleRegister} />
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
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
  },
});

export default RegisterScreen;
