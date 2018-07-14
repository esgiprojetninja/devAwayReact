import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    Button,
    TouchableHighlight
} from 'react-native';
import t from 'tcomb-form-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { API_URL } from 'react-native-dotenv';

import Util from './../utils/util';

const Form = t.form.Form;

export default class LoginScreen extends React.Component {

    constructor(props) {

        console.log("-- LOGIN --");

        super(props);

        this.resetActionLogin = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'USERPROFILE' })],
        });
        this.resetActionLogout = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'LOGIN' })],
        });

        const token = Util.getToken().then((token) => {
            console.log(token);
            if (token.status == "ok" && token.token != null) {
                this.props.navigation.dispatch(this.resetActionLogin);
            }
        }, (error) => {
            console.log(error) //Display error
        });;

        this.User = t.struct({
            email: t.String,
            password: t.String,
        });

        this.options = {
            fields: {
                email: {
                    hasError: false,
                    error: ""
                },
                password: {
                    password: true,
                    secureTextEntry: true,
                    hasError: false,
                    error: ""
                },
            },
        };

        this.state = {
            options: this.options,
            value: null
        };

        this.navigationOptions = {
            title: 'LoginScreen',
        }
    }

    userLogOut = async () => {
        await Util.removeToken();
        this.props.navigation.dispatch(this.resetActionLogout);
    }

    handleSubmit = () => {
        const value = this._form.getValue(); // use that ref to get the form value
        if (value) {
            fetch(API_URL + '/api/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(value),
            })
                .then(response => {
                    console.log("Fetching API LOGIN");
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json()  //we only get here if there is no error
                })
                .then(json => {
                    Util.setToken(json.success.token);
                    this.props.navigation.dispatch(this.resetActionLogin);
                })
                .catch(err => {
                    err.json().then(errorMessage => {
                        console.log(errorMessage);
                    });
                })
        }
    }

    isLoaded() {
        this.setState({ loaded: true })
    }

    isLoading() {
        this.setState({ loaded: false })
    }

    signUpTrigger = () => {
        //@todo redirect
        const { navigate } = this.props.navigation;
        navigate('SUBSCRIBE');
    }

    render() {
        return (
            <View style={styles.container}>
                <Form
                    ref={c => this._form = c} // assign a ref
                    type={this.User}
                    options={this.state.options}
                    value={this.state.value}
                />
                <TouchableHighlight style={styles.button} onPress={this.handleSubmit} underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Login!</Text>
                </TouchableHighlight>

                <Text onPress={this.signUpTrigger}>Or sign up!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 100
    },
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
    }
});