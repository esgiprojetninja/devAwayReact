import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  ListView,
  TouchableOpacity
} from 'react-native';
import { API_URL } from 'react-native-dotenv';
import { StackActions, NavigationActions } from 'react-navigation';
import Util from './../utils/util';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageCarousel from 'react-native-image-page';

export default class MessagesList extends React.Component {
  constructor(props) {
    console.log("LOADING ALL MESSAGES");

    super(props);

    this.state = {
      loaded: false,
      messages: {},
      tokenValue: "",
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
      console.log("Fetching all messages");
      console.log(API_URL);
      fetch(API_URL + '/api/v1/messages/me/latest', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          console.log("Get response");
          if (!response.ok) {
            if (response.status >= 401) {
              this.props.navigation.dispatch(this.resetAction);
            }
            throw response;
          }
          return response.json();
        })
        .then(json => {
          console.log("GOOD");
          this.state.messages = json;
          this.isLoaded();
        })
        .catch(err => {
          console.log("RIP");
          err.json().then(errorMessage => {
            console.log(errorMessage);
          });
        })
    });
  }

  isLoaded() {
    this.setState({ loaded: true })
  }

  _onPress = (id_accommodation) => {
    this.props.navigation.navigate(
      'ACCOMMODATION',
      { id_accommodation },
    );
  }

  renderGridItem(message) {
    return (
      <TouchableOpacity style={styles.gridItem} onPress={() => this._onPress(message.id)}>
        <View>
          <View style={styles.containerTextStyle}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textBedroomStyle}>{textBedroom}</Text>
              <Text style={styles.textBedroomStyle}> - {accommodation.nbMaxAdult} <Icon name="user" size={12} /></Text>
            </View>
            <View>
              <Text style={styles.textTitleStyle}>{accommodation.title}</Text>
            </View>
            <View>
              <Text style={styles.textCityStyle}>{accommodation.city}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity >
    );
  }

  render() {
    if (this.state.loaded) {
      var dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });
      var listItems = dataSource.cloneWithRows(this.state.accommodations);
      return (
        <ScrollView style={styles.containerAccommodations}>

          <Text>Affichage de 125 accommodations</Text>

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
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  gridItem: {
    margin: 5,
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBedroomStyle: {
    fontSize: 10
  },
  textTitleStyle: {
    fontWeight: 'bold',
  },
  textVerified: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  containerTextStyle: {
    marginTop: 6
  },
  navBar: {
    backgroundColor: 'transparent',
  },
});
