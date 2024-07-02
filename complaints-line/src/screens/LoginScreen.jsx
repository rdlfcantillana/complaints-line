import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import { loginUser, sendResetPasswordEmail } from '../api/auth';
import HomeScreen from './HomeScreen';

const LoginScreen = ({ navigation }) => {
  const [ci, setCi] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const data = await loginUser(ci, password);
      if (data.roles && data.roles.includes('ciudadano')) {
        await login(data.token);
      } else {
        setError('Only ciudadano can log in.');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendResetPasswordEmail({ email }, { headers: { source: 'react-native' } });
      alert('Password reset email sent');
    } catch (err) {
      alert('Error sending reset email');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Enter your CI and password to log in.</Text>

      <Input placeholder="Enter your CI" value={ci} onChangeText={setCi} />
      <Input placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
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
  error: {
    color: 'red',
    marginBottom: 20,
  },
  forgotPassword: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
