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
import { createBottomTabNavigator, createStackNavigator, NavigationActions } from 'react-navigation';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MessageScreen from './src/screens/MessageScreen';
import SubscribeScreen from './src/screens/SubscribeScreen';
import AccommodationsList from './src/screens/AccommodationsList';
import Accommodation from './src/screens/Accommodation';

import LoginScreen from './src/screens/LoginScreen';

const navigatorProfile = createStackNavigator({
  USERPROFILE: ProfileScreen,
  LOGIN: {screen: LoginScreen, headerMode: 'none'},
  SUBSCRIBE: SubscribeScreen,
});

const exploreProfile  = createStackNavigator({
  HOME: HomeScreen,
  ACCOMMODATIONSLIST: AccommodationsList,
  PROFILE: navigatorProfile,
  ACCOMMODATION: Accommodation
});

export default createBottomTabNavigator({
    EXPLORE: exploreProfile,
    MESSAGE: MessageScreen,
    PROFILE: navigatorProfile
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
