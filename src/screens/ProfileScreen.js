import React, { PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  StatusBar
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { API_URL } from 'react-native-dotenv';
import * as Progress from 'react-native-progress';
import { Font } from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Util from './../utils/util';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    headerTransparent: {
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: 100,
      top: 0, left: 0, right: 0,
      border: 0
    }, headerStyle: {
      borderBottomWidth: 0,
    }
  };
  constructor(props) {

    console.log("-- PROFILE --");

    super(props);
    this.state = { loaded: false }
    tokenValue = "";
    user = {};
    let redirected = false;
    this.resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'LOGIN' })],
    });

    const token = Util.getToken().then(tok => {
      if (tok.status == "error" || tok.token == null) {
        console.log("NEED REDIRECT");
        redirected = true;
        this.props.navigation.dispatch(this.resetAction);
      }
      this.tokenValue = tok.token;
    }, (error) => {
      console.log('HERE');
      console.log(error) //Display error
    }).done((data) => {
      if (!redirected) {
        console.log(API_URL);
        fetch(API_URL + '/api/v1/users/me', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.tokenValue,
          }
        })
          .then(response => {
            console.log(response);
            if (!response.ok) {
              console.log("PROFILE ICI");
              if (response.status >= 401) {
                this.userLogOut();
              }
              throw response;
            }
            return response.json();
          })
          .then(json => {
            this.user = json;
            this.isLoaded();
          })
          .catch(err => {
            console.log("ERORR INSTANT");
            console.log(err);
            err.json().then(errorMessage => {
              console.log("RIP PROFILE");
              console.log(errorMessage);
            });
          })
      }
    });
  }

  componentDidMount() {
    Font.loadAsync({
      'roboto': require('./../../public/fonts/Roboto-Regular.ttf'),
    });
  }

  isLoaded() {
    console.log('isLoaded')
    this.setState({ loaded: true })
  }

  _showProfile = (id_user) => {
    this.props.navigation.navigate(
      'USERPROFILESCREEN',
      { id_user },
    );
  }

  userLogOut = async () => {
    await Util.removeToken();
    this.props.navigation.dispatch(this.resetAction);
  }

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.containerHeader}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="red"
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.firstName}>{this.user.firstName}</Text>
              <Text style={{ marginTop: 10, fontFamily: 'roboto' }} onPress={() => this._showProfile(this.user.id)} >Show and update profile</Text>
            </View>
            <Image style={styles.headerAvatar} source={{ uri: "data:image/png;base64," + this.user.avatar }} />
          </View>

          <View style={{ flex: 1, marginTop: 50 }}>
            <Text style={{ fontSize: 16, marginBottom: 10, color: '#343434', fontFamily: 'roboto' }}>There are 2 more steps</Text>
            <Progress.Bar progress={0.5} width={314} color={'#C74422'} unfilledColor={'#CBCBCB'} borderWidth={0} borderRadius={6} height={40} />

            <Text style={{ fontSize: 16, marginTop: 20, marginRight: 40, color: '#343434', fontFamily: 'roboto' }}>
              We are asking to our members some informations about themself before travelling or booking. Take the lead and do it now!
            </Text>

            <View style={styles.separatorFullWidthGrey} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 2 }}>
              <Text style={styles.notificationText}>Notifications</Text>
              <Ionicons name={"ios-notifications-outline"} size={26} color={"black"} />
            </View>

            <View style={styles.separatorFullWidthGrey} />

            <View style={{ flex: 1, marginTop: 20 }}>
              <TouchableHighlight style={styles.button} onPress={this.userLogOut} underlayColor='#99d9f4'>
                <Text style={styles.buttonText}>Log out!</Text>
              </TouchableHighlight>
            </View>

          </View>

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
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 30
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  headerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  containerHeader: {
    flex: 1,
    marginTop: 120,
    marginLeft: 30,
    marginRight: 30,
    justifyContent: 'flex-start',
  },
  firstName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#202020',
    fontFamily: "roboto"
  },
  notificationText: {
    fontSize: 18,
    color: '#404040',
    fontFamily: "roboto"
  },
  showProfile: {
    color: '#343434'
  },
  separatorFullWidthGrey: {
    borderBottomColor: '#404040',
    borderBottomWidth: 0.6,
    marginTop: 20,
    marginBottom: 20
  },
});