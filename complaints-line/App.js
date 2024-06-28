import 'react-native-gesture-handler';
import React, { useEffect, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainScreen from './src/screens/MainScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeTabs from './src/screens/HomeTabs';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

const Stack = createStackNavigator();

function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState('Main');

  const saveCurrentRoute = async (route) => {
    try {
      await AsyncStorage.setItem('currentRoute', route);
    } catch (error) {
      console.error('Error saving current route:', error);
    }
  };

  const getCurrentRoute = async () => {
    try {
      const route = await AsyncStorage.getItem('currentRoute');
      if (route) {
        setInitialRoute(route);
      }
    } catch (error) {
      console.error('Error getting current route:', error);
    }
  };

  useEffect(() => {
    getCurrentRoute();
  }, []);

  if (isLoading) {
    return null; // Puedes agregar una pantalla de carga aquí
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      {userToken ? (
        <>
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
            listeners={({ navigation, route }) => ({
              state: (e) => {
                const currentRoute = route.state
                  ? route.state.routes[route.state.index].name
                  : route.name;
                saveCurrentRoute(currentRoute);
              },
            })}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const linking = {
    prefixes: ['myapp://', 'https://myapp.com','http://localhost:8081'],
    config: {
      screens: {
        ResetPassword: 'reset-password/:token',
      },
    },
  };

  return (
    <AuthProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
