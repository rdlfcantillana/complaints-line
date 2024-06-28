import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { sendResetPasswordEmail } from '../api/auth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  
const handleSendResetEmail = async () => {
    try {
      await sendResetPasswordEmail(email);
      setMessage('Password reset email sent');
    } catch (err) {
      setMessage('Error sending reset email');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a password reset link.</Text>
      <Input placeholder="Enter your email" value={email} onChangeText={setEmail} />
      <Button title="Send Reset Email" onPress={handleSendResetEmail} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
  message: {
    marginTop: 20,
    color: 'green',
  },
});

export default ForgotPasswordScreen;
