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

export default class DiscutionScreen extends React.Component { 
  render() {
    const id_user = this.props.navigation.getParam('id_user', 'NO-ID')
    return (
      <View style={{ flex: 1 }}>
            <Text>Discution</Text>
            <Text>API_URL={API_URL}</Text>
            <Text>{id_user}</Text>
      </View>
    );
  }
}

