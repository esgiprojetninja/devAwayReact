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
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MessagesList from './src/screens/MessagesList';
import SubscribeScreen from './src/screens/SubscribeScreen';
import AccommodationsList from './src/screens/AccommodationsList';
import AccommodationScreen from './src/screens/Accommodation';
import DiscutionScreen from './src/screens/DiscutionScreen';
import LoginScreen from './src/screens/LoginScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';

const navigatorExplore = createStackNavigator({
  HOME: HomeScreen,
  ACCOMMODATIONSLIST: AccommodationsList,
  ACCOMMODATION: AccommodationScreen,
});

const navigatorProfile = createStackNavigator({
  USERPROFILE: ProfileScreen,
  LOGIN: LoginScreen,
  SUBSCRIBE: SubscribeScreen,
  USERPROFILESCREEN: UserProfileScreen,
});

const navigatorMessage = createStackNavigator({
  MESSAGELIST: MessagesList,
  DISCUTION: DiscutionScreen,
});

export default createBottomTabNavigator({
  EXPLORE: navigatorExplore,
  MESSAGE: navigatorMessage,
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
