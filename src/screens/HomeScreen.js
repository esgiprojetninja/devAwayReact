import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  Button,
  ActivityIndicator
} from 'react-native';
import { SearchBar } from 'react-native-elements'

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: 'transparent',
        right: 0,
        left: 0,
        top: 0,
        position: 'absolute',
        borderBottomWidth: 0,
      },
    };
  }

  constructor(props) {

    super(props);

    this.state = {
      loaded: true,
    }

    this.isLoaded();
  }

  isLoaded() {
    console.log('loaded');
    this.setState({ loaded: true })
  }

  accommodationsListTrigger = () => {
    const { navigate } = this.props.navigation;
    navigate('ACCOMMODATIONSLIST');
  }

  someMethod = () => {
    console.log("lmkfdkljfslmkfdlmfdslmdflmkfdlmdfslmkdsflmdfsmlfdsmlkfdslmkfdsmlk");
  }

  render() {
    if (this.state.loaded) {
      console.log('rendering');
      return (
        <View style={{ flex: 1 }}>
          <ImageBackground
            style={styles.background}
            source={require("../../public/img/home-background.png")}
          >
            <SearchBar
              onChangeText={this.someMethod}
              onClear={this.someMethod}
              placeholder='Type Here...' />

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
    } else {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
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
