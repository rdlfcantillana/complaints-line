import React, { useEffect, useState, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './HomeScreen';
import ResponsesScreen from './ResponsesScreen';
import FeedbackScreen from './FeedbackScreen';
import ProfileScreen from './ProfileScreen'; 
import LogoutButton from '../components/LogoutButton';
import { AuthContext } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

function HomeTabs() {
  const { activeTab, setActiveTab } = useContext(AuthContext);

  const handleTabChange = async (route) => {
    try {
      setActiveTab(route.name);
      await AsyncStorage.setItem('currentTab', route.name);
    } catch (error) {
      console.error('Error saving current tab:', error);
    }
  };

  useEffect(() => {
    const getCurrentTab = async () => {
      try {
        const tab = await AsyncStorage.getItem('currentTab');
        if (tab) {
          setActiveTab(tab);
        }
      } catch (error) {
        console.error('Error getting current tab:', error);
      }
    };

    getCurrentTab();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={activeTab}
      screenListeners={({ route }) => ({
        state: () => {
          handleTabChange(route);
        },
      })}
    >
      <Tab.Screen
        name="Quejas"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="clipboard" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Responses"
        component={ResponsesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbubbles" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="star" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}  
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      {/* <Tab.Screen
        name="Logout"
        component={LogoutButton}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="log-out" color={color} size={size} />
          ),
          headerShown: false,
        }}
      /> */}
    </Tab.Navigator>
  );
}

export default HomeTabs;
