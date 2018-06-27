import React from 'react';
import { 
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView
} from 'react-native';
import { API_URL } from 'react-native-dotenv';

export default class MessageScreen extends React.Component { 
  render() {
    return (
      <View style={{ flex: 1 }}>
            <Text>MESSAGED</Text>
            <Text>API_URL={API_URL}</Text>
      </View>
    );
  }
}

