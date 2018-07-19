import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableHighlight,
    TouchableOpacity,
    Button,
    Modal
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { API_URL } from 'react-native-dotenv';
import { Font } from 'expo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import t from 'tcomb-form-native';
import Util from './../utils/util';

const Form = t.form.Form;

export default class UserProfileScreen extends React.Component {
    constructor(props) {

        console.log("-- PROFILE USER --");

        super(props);

        let redirected = false;
        this.resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'LOGIN' })],
        });
        const id_user = this.props.navigation.getParam('id_user', 'NO-ID')
        this.props.navigation.setParams({
            headerRightCustom: ""
        });

        this.User = t.struct({
            firstName: t.String,
            lastName: t.String,
            userName: t.String,
            email: t.String
        });

        this.options = {
            fields: {
                email: {
                    hasError: false,
                    error: ""
                },
                firstName: {
                    hasError: false,
                    error: ""
                },
                lastName: {
                    hasError: false,
                    error: ""
                },
                userName: {
                    hasError: false,
                    error: ""
                },
            },
        };

        this.state = {
            loaded: false,
            modalVisible: false,
            tokenValue: "",
            user: {},
            options: this.options,
        }

        const token = Util.getToken().then(tok => {
            if (tok.status == "error" || tok.token == null) {
                console.log("NEED REDIRECT");
                redirected = true;
                this.props.navigation.dispatch(this.resetAction);
            }
            this.state.tokenValue = tok.token;
        }, (error) => {
            console.log(error) //Display error
        }).done((data) => {
            if (!redirected) {
                console.log(id_user);
                fetch(API_URL + '/api/v1/users/' + id_user, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.state.tokenValue,
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            console.log(reponse);
                            if (response.status >= 401 && response.status != 404) {
                                this.userLogOut();
                            }
                            throw response;
                        }
                        return response.json();
                    })
                    .then(json => {
                        this.state.user = json;
                        this.state.value= {
                            email: this.state.user.email,
                            lastName: this.state.user.lastName,
                            firstName:this.state.user.firstName,
                            userName:this.state.user.userName
                        }
                        this.isLoaded();
                        this.props.navigation.setParams({
                            headerRightCustom: (<TouchableOpacity onPress={() => this.setModalVisible(true)}>
                                <Text style={{ marginRight: 10 }}>Update</Text>
                            </TouchableOpacity>)
                        });
                    })
                    .catch(err => {
                        err.json().then(errorMessage => {
                            console.log("RIP PROFILE");
                            console.log(errorMessage);
                        });
                    })
            }
        });
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerTransparent: {
                position: 'absolute',
                backgroundColor: 'transparent',
                zIndex: 100,
                top: 0, left: 0, right: 0,
                border: 0
            }, headerTitleStyle: {
                color: 'black'
            }, headerTintColor: 'black',
            headerStyle: {
                borderBottomWidth: 0,
            },
            headerRight: navigation.state.params.headerRightCustom
        }
    };

    handleSubmit = () => {
        const value = this._form.getValue(); // use that ref to get the form value
        if (value) {
            fetch(API_URL + '/api/users/' + this.state.user.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.tokenValue,
                },
                body: JSON.stringify(value),
            })
                .then(response => {
                    console.log("Fetching API USER UPDATE");
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json()  //we only get here if there is no error
                })
                .then(json => {
                    console.log("DONE");
                })
                .catch(err => {
                    err.json().then(errorMessage => {
                        console.log(errorMessage);
                    });
                })
        }
    }

    componentDidMount() {
        Font.loadAsync({
            'roboto': require('./../../public/fonts/Roboto-Regular.ttf'),
        });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    isLoaded() {
        console.log('isLoaded')
        this.setState({ loaded: true })
    }

    userLogOut = async () => {
        await Util.removeToken();
        this.props.navigation.dispatch(this.resetAction);
    }

    render() {
        const { state } = this.props.navigation;
        Moment.locale('en');
        console.log("ALED"+this.state.modalVisible);
        if (this.state.loaded) {
            let verifiedInformations = (<Text>None</Text>)
            if (this.state.user.emailVerified == 1) {
                verifiedInformations = (<Text>E-mail</Text>);
            }
            return (
                <View style={styles.containerHeader}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={styles.firstName}>{this.state.user.firstName} {this.state.user.lastName}</Text>
                            <Text style={{ marginTop: 10, fontFamily: 'roboto' }} > {this.state.user.city}, {this.state.user.country} </Text>
                        </View>
                        <Image style={styles.headerAvatar} source={{ uri: "data:image/png;base64," + this.state.user.avatar }} />
                    </View>

                    <View style={{ flex: 1, marginTop: 50 }}>
                        <Text style={{ fontSize: 16, marginBottom: 10, color: '#343434', fontFamily: 'roboto' }}>Member since</Text>
                        <Text style={{ fontSize: 16, marginBottom: 10, color: '#343434', fontFamily: 'roboto' }}> {Moment(this.state.user.created_at).format('MMMM YYYY')} </Text>

                        <View style={styles.separatorFullWidthGrey} />

                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingTop: 2 }}>
                            <Text style={styles.notificationText}>Verified informations</Text>
                            {verifiedInformations}
                        </View>

                    </View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                    >
                        <View>
                            <View style={{ height: 80, backgroundColor: 'white' }}>
                                <View style={{ marginTop: 40, flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Ionicons style={{ margin: 0, padding: 0 }} name={"ios-close"} size={45} color={'black'} onPress={() => this.closeModal()} />
                                    <Text style={{ marginTop: 14 }}>Update profile</Text>
                                    <Text style={{ marginTop: 14 }}>Save</Text>
                                </View>
                            </View>

                            <View style={{ width: '100%', backgroundColor: '#D0D0D0' }}>
                                <Image style={{ height: 250, width: '80%', alignSelf: 'center' }} source={{ uri: "data:image/png;base64," + this.state.user.avatar }} />
                            </View>

                            <Form
                                ref={c => this._form = c} // assign a ref
                                type={this.User}
                                options={this.state.options}
                                value={this.state.value}
                            />
                        </View>
                    </Modal>
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
