import React from 'react';
import { 
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  Button
} from 'react-native';

export default class HomeScreen extends React.Component { 

  accommodationsListTrigger = () => {
    const {navigate} = this.props.navigation;
    navigate('ACCOMMODATIONSLIST');
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={styles.background}
          source={require("../../public/img/home-background.png")}
        >
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
