import React from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    ListView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { API_URL } from 'react-native-dotenv';
import { Font } from 'expo';
import { StackActions, NavigationActions } from 'react-navigation';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

import Util from './../utils/util';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class AccommodationScreen extends React.Component {
    static navigationOptions = {
        headerTransparent: {
            position: 'absolute',
            backgroundColor: 'transparent',
            zIndex: 100,
            top: 0, left: 0, right: 0,
            border: 0
        }, headerTitleStyle: {
            color: 'black'
        }, headerStyle: {
            borderBottomWidth: 0,
        }
    };
    constructor(props) {
        console.log("LOADING ONE ACCOMMODATION");

        super(props);

        const id_accommodation = this.props.navigation.getParam('id_accommodation', 'NO-ID')

        this.state = {
            loaded: false,
            accommodation: {},
            tokenValue: "",
            scrollY: new Animated.Value(0),
            region: {}
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
            console.log(error) //Display error
        }).done((data) => {
            fetch(API_URL + '/api/v1/accommodations/' + id_accommodation, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(json => {
                    console.log("GOOD one accommodation");
                    this.state.accommodation = json;
                    this.state.region = {
                        latitude: this.state.accommodation.latitude,
                        longitude: this.state.accommodation.longitude
                    }
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

    _onPress = (id_host) => {
        this.props.navigation.navigate(
            'DISCUTION',
            { id_host },
        );
    }

    render() {
        const HEADER_MAX_HEIGHT = 280;
        const HEADER_MIN_HEIGHT = 100;
        const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp'
        });
        const imageOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -50],
            extrapolate: 'clamp',
        });
        if (this.state.loaded) {
            let pictures = [];
            if (this.state.accommodation.pictures && this.state.accommodation.pictures.length > 0) {
                if (this.state.accommodation.pictures.length > 1) {
                    for (i = 0; i < this.state.accommodation.pictures.length; i++) {
                        pictures.push({ uri: "data:image/png;base64," + this.state.accommodation.pictures[i].url });
                    }
                } else {
                    pictures.push({ uri: "data:image/png;base64," + this.state.accommodation.pictures[0].url });
                }
            } else {
                pictures.push({ uri: "http://localhost:3000/img/accommodation.jpg" });
            }
            this.state.region = {
                latitude: this.state.accommodation.latitude,
                longitude: this.state.accommodation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
                console.log(this.state.region);
            /*UtilBrigthness.getImageLightness(pictures[0].uri,function(brightness){
                console.log(brightness);
            });*/

            return (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <ScrollView style={{ flex: 1 }}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
                        )}>
                        <View style={styles.containerInformations}>
                            <Text style={styles.headerTypeAccommodation}>{"Logement entier".toUpperCase()}</Text>
                            <Text style={styles.headerTitle}>{this.state.accommodation.title}</Text>
                            <View style={styles.containerHost}>
                                <View style={{ width: '100%' }}>
                                    <Text style={styles.headerLocation}>{this.state.accommodation.country}, {this.state.accommodation.city}</Text>
                                    <Text style={styles.headerHost}>Host: {this.state.accommodation.host.firstName}</Text>
                                </View>
                                <Image style={styles.headerAvatar} source={{ uri: "data:image/png;base64," + this.state.accommodation.host.avatar }} />
                            </View>
                            <View style={{ flex: 1, marginTop: 20, marginRight: 30 }}>
                                <View style={styles.headerIconItems}>
                                    <Text style={styles.headerIconOneItem}><Icon name="user" size={16} color="black" /> {this.state.accommodation.nbMaxAdult} travellers</Text>
                                    <Text style={styles.headerIconOneItem}><Icon name="user" size={16} color="black" /> {this.state.accommodation.nbBedroom + this.state.accommodation.nbBathroom} rooms</Text>
                                </View>
                                <View style={styles.headerIconItems}>
                                    <Text style={styles.headerIconOneItem}><Icon name="bed" size={16} color="black" /> {this.state.accommodation.nbBedroom} beds</Text>
                                    <Text style={styles.headerIconOneItem}><Icon name="bath" size={16} color="black" /> {this.state.accommodation.nbBathroom} baths</Text>
                                </View>
                            </View>
                            <Text style={styles.headerDescription}>{this.state.accommodation.description}</Text>
                            <View style={styles.separatorFullWidthGrey} />
                            <Text style={styles.casualTitle}>{this.state.accommodation.minStay} nights minimum !</Text>
                            <View style={styles.separatorFullWidthGrey} />
                            <View>
                                <Text style={styles.casualTitle}>Equipments</Text>
                                <View style={{ marginTop: 10, marginRight: 30, flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Icon name="smoking" size={20} color="green" />
                                    <Icon name="user" size={20} color="black" />
                                    <Icon name="wifi" size={20} color="red" />
                                    <Icon name="youtube" size={20} color="red" />
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <MapView
                                    style={
                                        styles.map
                                    }
                                    region={this.state.region}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: this.state.accommodation.latitude,
                                            longitude: this.state.accommodation.longitude,
                                        }}
                                        title={this.state.accommodation.title}
                                    />
                                </MapView>
                            </View>
                            <View style={styles.separatorFullWidthGrey} />
                            <TouchableOpacity onPress={() => this._onPress(this.state.accommodation.host.id)}>
                                <Text style={styles.casualTitle}>Contact host! <Icon name="chevron-right" size={16} color="grey" /></Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <Animated.View style={[styles.header, { height: headerHeight }]}>
                        <Animated.Image
                            style={[
                                styles.backgroundImage,
                                { opacity: imageOpacity, transform: [{ translateY: imageTranslate }] },
                            ]}
                            source={pictures[0]}
                        />
                    </Animated.View>
                </View >

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
        justifyContent: 'center',
        position: 'relative'
    },
    map: {
        flex: 1,
        position: 'relative',
        width: '110%',
        marginLeft: -30,
        marginRight: -30,
        height: 300,
        marginTop: 30,
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    containerAccommodations: {
        flex: 1
    },
    imageHeader: {
        width: '100%',
        height: 280,
        top: 0,
        left: 0,
        position: 'absolute'
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
    },
    scrollViewContent: {
        marginTop: 200,
    },
    headerTypeAccommodation: {
        fontSize: 14,
        marginBottom: 10,
        color: "#808080"
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: 280,
        resizeMode: 'cover',
    },
    containerInformations: {
        marginTop: 300,
        marginLeft: 30,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingRight: 90
    },
    headerLocation: {
        fontSize: 15,
        marginTop: 30,
        color: "#808080",
        marginRight: 30,
        width: '70%'
    },
    headerHost: {
        fontSize: 15,
        color: "#808080",
        width: '30%'
    },
    headerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 'auto',
        marginRight: 40,
        marginTop: 15,
        borderWidth: 0.5,
        borderColor: 'black',
    },
    containerHost: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    headerIconItems: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10
    },
    headerIconOneItem: {
        width: '50%',
        color: "#808080"
    },
    headerDescription: {
        fontSize: 16,
        marginTop: 20,
        marginRight: 30
    },
    separatorFullWidthGrey: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginRight: 30,
        marginTop: 20,
        marginBottom: 20
    },
    casualTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});
