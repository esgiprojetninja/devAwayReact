import React, { PropTypes } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import Util from './../utils/util';

export default class ProfileScreen extends React.Component { 
  constructor(props) {

    super(props);
    this.state = {loaded : false}
    tokenValue = "";
    user = {};
    this.resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'LOGIN' })],
    });

    const token = Util.getToken().then(tok => {
      if(tok.status == "error" || tok.token == null){
        this.props.navigation.dispatch(this.resetAction);
      }
      this.tokenValue = tok.token;
    }, (error) => {
      console.log(error) //Display error
    }).done((data) => {
      fetch('https://limitless-springs-83583.herokuapp.com/api/user/me', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+this.tokenValue, 
        }
      })
      .then( response => {
          if (!response.ok) { 
              throw response;
          }
          return response.json();
      })
      .then(json => {
          this.user = json;
          this.isLoaded();
      })
      .catch( err => {
          err.json().then( errorMessage => {
              console.log("RIP");
              console.log(errorMessage);
          });
      })
    });
  }

  isLoaded(){
		console.log('isLoaded')
		this.setState({loaded: true})
	}

  userLogOut = async () => {
    await Util.removeToken();  
    this.props.navigation.dispatch(this.resetAction);
  }

  render() {
    if(this.state.loaded){
      return (
        <View style={{ flex: 1 }}>

            <Text>User: {this.user.email}</Text>

            <TouchableHighlight style={styles.button} onPress={this.userLogOut} underlayColor='#99d9f4'>
              <Text style={styles.buttonText}>Log out!</Text>
            </TouchableHighlight>
        </View>
      );
    }else{
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
      justifyContent: 'center'
  },
  horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
  }
});