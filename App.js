import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  Button
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MessageScreen from './src/screens/MessageScreen';

import LoginScreen from './src/screens/LoginScreen';

export default createBottomTabNavigator({
    EXPLORE: HomeScreen,
    MESSAGE: MessageScreen,
    PROFILE: LoginScreen
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'EXPLORE') {
          iconName = `ios-search${focused ? '' : '-outline'}`;
        } else if (routeName === 'PROFILE') {
          iconName = `ios-contact${focused ? '' : '-outline'}`;
        } else if (routeName === 'MESSAGE') {
          iconName = `ios-chatboxes${focused ? '' : '-outline'}`;
        }
        
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    
    tabBarOptions: {
      style: {
          backgroundColor: '#fff',
          padding: 8,
      }
  }
});

