import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { resetPassword } from '../api/auth';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { token } = route.params; // El token debería ser pasado como parámetro desde el enlace del correo electrónico
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      await resetPassword(token, password);
      setMessage('Password reset successful.');
      navigation.navigate('Login'); // Navegar a la pantalla de login después de restablecer la contraseña
    } catch (err) {
      setMessage('Error resetting password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your new password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ResetPasswordScreen;
