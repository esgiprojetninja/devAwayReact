import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  ListView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { API_URL } from 'react-native-dotenv';
import { StackActions, NavigationActions } from 'react-navigation';
import Util from './../utils/util';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageCarousel from 'react-native-image-page';

export default class MessagesList extends React.Component {
  constructor(props) {

    console.log("-- MESSAGE --");

    super(props);

    this.state = {
      loaded: false,
      messages: {},
      tokenValue: "",
      //myId: ''
    }

    this.resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'LOGIN' })],
    });

    const token = Util.getToken().then(tok => {
      if (tok.status != "error" || tok.token != null) {
        this.state.tokenValue = tok.token;
      }
    }, (error) => {
      console.log("Error token:" + error) //Display error
    }).done((data) => {
      fetch(API_URL + '/api/v1/messages/me/latest', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.tokenValue,
        }
      })
        .then(response => {
          if (!response.ok) {
            if (response.status >= 401) {
              this.props.navigation.dispatch(this.resetAction);
            }
            throw response;
          }
          console.log(response.json());
          return response.json();
        })
        .then(json => {
          this.state.messages = json;
          //this.state.myId = json.myId;
          this.isLoaded();
        })
        .catch(err => {
          console.log(err);
          err.json().then(errorMessage => {
            console.log(errorMessage);
          });
        })
    });
  }

  isLoaded() {
    this.setState({ loaded: true })
  }

  _onPress = (id_user) => {
    this.props.navigation.navigate(
      'USERPROFILESCREEN',
      { id_user },
    );
  }

  renderGridItem(message) {
    if (message.from.id == 1) {
      let messageContent = message.content.substring(0, 30);
      if (message.content.length > 30) {
        messageContent = messageContent + " ...";
      }
      return (
        <TouchableOpacity style={styles.gridItem} onPress={() => this._onPress(message.to.id)}>
          <View style={styles.containerImageText}>
            <View style={styles.containerImage}>
              <Image style={styles.headerAvatar} source={{ uri: "data:image/png;base64," + message.to.avatar }} />
            </View>
            <View style={styles.containerText}>
              <View style={styles.containerNameHour}>
                <Text style={styles.textName}> {message.to.firstName} {message.to.lastName} </Text>
                <Text style={styles.hour}> {(message.created_at).slice(-8, -3)} </Text>
              </View>
              <Text> Vous: {messageContent} </Text>
            </View>
          </View>
        </TouchableOpacity >
      );
    } else {
      let messageContent = message.content.substring(0, 35);
      if (message.content.length > 35) {
        messageContent = messageContent + " ...";
      }
      return (
        <TouchableOpacity style={styles.gridItem} onPress={() => this._onPress(message.from.id)}>
          <View style={styles.containerImageText}>
            <View style={styles.containerImage}>
              <Image style={styles.headerAvatar} source={{ uri: "data:image/png;base64," + message.from.avatar }} />
            </View>
            <View style={styles.containerText}>
              <View style={styles.containerNameHour}>
                <Text style={styles.textName}> {message.from.firstName} {message.from.lastName} </Text>
                <Text style={styles.hour}> {(message.created_at).slice(-8, -3)} </Text>
              </View>
              <Text> {messageContent} </Text>
            </View>
          </View>
        </TouchableOpacity >
      );
    }

  }

  render() {
    if (this.state.loaded) {
      var dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });
      var listItems = dataSource.cloneWithRows(this.state.messages);
      return (
        <ScrollView style={styles.containerAccommodations}>
          <StatusBar
            barStyle="dark-content"
          />
          <ListView
            contentContainerStyle={styles.grid}
            dataSource={listItems}
            renderRow={(item) => this.renderGridItem(item)}
          />
        </ScrollView>
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
  containerAccommodations: {
    flex: 1
  },
  grid: {
    flex: 1,
  },
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  containerImageText: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  hour: {
    fontSize: 12
  },
  containerText: {
    width: '82%',
    marginRight: 20,
    marginTop: 3,
    marginLeft: 6
  },
  containerImage: {
    width: '10%',
    marginLeft: 6
  },
  containerNameHour: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textName: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});
