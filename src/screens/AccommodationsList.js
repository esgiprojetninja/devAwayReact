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

export default class AccommodationsScreen extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loaded: false,
            accommodations: {},
            tokenValue: "",
        }
        this.resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'LOGIN' })],
        });

        const token = Util.getToken().then(tok => {
            if (tok.status == "error" || tok.token == null) {
                this.props.navigation.dispatch(this.resetAction);
            }
            this.state.tokenValue = tok.token;
        }, (error) => {
            console.log(error) //Display error
        }).done((data) => {
            fetch(API_URL + '/api/v1/accommodations', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.tokenValue,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(json => {
                    this.state.accommodations = json;
                    this.isLoaded();
                })
                .catch(err => {
                    err.json().then(errorMessage => {
                        console.log("RIP");
                        console.log(errorMessage);
                    });
                })
        });
    }

    isLoaded() {
        this.setState({ loaded: true })
    }

    renderGridItem(accommodation) {
        let uriPicture = "https://cdn.pixabay.com/photo/2014/04/02/11/15/house-305683_960_720.png";
        if (accommodation.pictures && accommodation.pictures.length > 0) {
            uriPicture = accommodation.pictures[0].url;
        }
        console.log(accommodation.pictures.length);
        let textBedroom = "1 LIT";
        if (accommodation.nbBedroom > 1) {
            textBedroom = accommodation.nbBedroom + " LITS";
        }
        return (
            <TouchableOpacity style={styles.gridItem}>
                <View>
                    <Image style={styles.gridItemImage} source={{ uri: uriPicture }} />
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
                        <View>
                            <Text><Icon name="star" size={12} /><Icon name="star" size={12} /><Icon name="star" size={12} /><Icon name="star" size={12} /><Icon name="star-half-o" size={12} /> 146</Text>
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
                    {/*
                        this.state.accommodations.map(function (accommodation) {
                            let uriPicture = "https://cdn.pixabay.com/photo/2014/04/02/11/15/house-305683_960_720.png";
                            if (accommodation.pictures && accommodation.pictures.length > 0) {
                                uriPicture = accommodation.pictures[0].url;
                            }
                            return (
                                <View style={styles.containerOneAccommodation}>
                                    <Text>ALLAHU</Text>
                                    <Image style={styles.headerAccommodation} source={{ uri: uriPicture }} />
                                </View>
                            )
                        })
                    */}
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
    headerAccommodation: {
        height: '33%',
        width: '80%'
    },
    containerAccommodations: {
        flex: 1,
        marginTop: 50,
    },
    grid: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    gridItem: {
        margin: 5,
        width: 320,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridItemImage: {
        width: 320,
        height: 200,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    gridItemText: {
        marginTop: 5,
        textAlign: 'center',
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
    }
});
