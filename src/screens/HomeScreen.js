import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  StatusBar,
  Button,
  TextInput
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTransparent: {
      backgroundColor: 'transparent',
    },
    headerStyle: {
      borderBottomWidth: 0,
    }
  };
  accommodationsListTrigger = () => {
    const { navigate } = this.props.navigation;
    navigate('ACCOMMODATIONSLIST');
  }

  render() {
    console.log("Load home");
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
        />
        <ImageBackground
          style={styles.background}
          source={require("../../public/img/home-background.png")}
        >
          <View style={styles.searchSection}>
            <Ionicons style={styles.searchIcon} name="ios-search" size={20} color="#000" />
            <TextInput
              style={styles.input}
              placeholder="User Nickname"
              onChangeText={(searchString) => { console.log(searchString) }}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.wrapper}>
            <View style={styles.wrapperLogoBrand}>
              <Image
                style={styles.logo}
                source={require("../../public/img/logo.png")}
              />
              <Image
                style={styles.brand}
                source={require("../../public/img/devawaytitle.png")}
              />
            </View>
            <View style={styles.separatorLogoBrand} />
          </View>
          <View style={styles.wrapperHeaderText}>
            <Text style={styles.headerTextOne}>
              Use our skills to share a human
            </Text>
            <Text style={styles.headerTextTwo} onPress={this.accommodationsListTrigger}>experience, it's a win-win</Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column", //Pour que le logo et la brand soit sur la meme ligne
    justifyContent: "center"
  },
  wrapper: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 130
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 70,
    left: 30,
    right: 30,
    height: 40,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#424242',
  },
  wrapperLogoBrand: {
    flexDirection: "row" //Pour que le logo et la brand soit sur la meme ligne
  },
  logo: {
    maxWidth: 80,
    maxHeight: 52
  },
  brand: {
    marginTop: 5,
    marginLeft: 15,
    maxWidth: 240,
    maxHeight: 40
  },
  separatorLogoBrand: {
    borderBottomColor: "white",
    borderBottomWidth: 2
  },
  wrapperHeaderText: {
    marginTop: 20
  },
  headerTextOne: {
    fontSize: 18,
    textAlign: "center",
    color: "white"
  },
  headerTextTwo: {
    fontSize: 18,
    textAlign: "center",
    color: "white"
  }
});