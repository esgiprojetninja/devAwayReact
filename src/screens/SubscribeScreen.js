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

const Form = t.form.Form;

export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);

        this.User = t.struct({
            email: t.String,
            username: t.String,
            password: t.String,
            c_password: t.String,
            terms: t.Boolean
        });
        
        this.options = {
            fields: {
                email: {
                    hasError: false,
                    error: ""
                },
                c_password: {
                    label: 'Confirm your password',
                    password: true,
                    secureTextEntry: true,
                    hasError: false,
                    error: ""
                },
                password: {
                    password: true,
                    secureTextEntry: true,
                    hasError: false,
                    error: ""
                },
                username: {
                    hasError: false,
                    error: ""
                },
                terms: {
                    label: 'Agree to terms',
                },
            },  
        };
    
        this.state = { 
            options: this.options,
            value: null
        };
    }

    handleSubmit = () => {
        const value = this._form.getValue(); // use that ref to get the form value
        if (value) {
            fetch('https://limitless-springs-83583.herokuapp.com/api/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(value),
            })
            .then( response => {
                if (!response.ok) { 
                    throw response;
                }
                return response.json()  //we only get here if there is no error
            })
            .then( json => {
                alert("success : "+json);
                console.log(json);
                this.props.dispatch(doSomethingWithResult(json))
            })
            .catch( err => {
                err.json().then( errorMessage => {
                    //{"error":{"email":["The email has already been taken."],"c_password":["The c password and password must match."]}}
                    console.log(errorMessage);
                    let emailHasError = false;
                    if(errorMessage.error.hasOwnProperty("email")){
                        emailHasError = true;
                    }
                    let cPasswordHasError = false;
                    if(errorMessage.error.hasOwnProperty("c_password")){
                        cPasswordHasError = true;
                    }
                    const options = t.update(this.state.options, {
                        fields: {
                            email: {
                                hasError: {'$set': emailHasError},
                                error: {'$set': errorMessage.error.email[0]}
                            },
                            c_password: {
                                hasError: {'$set': cPasswordHasError},
                                error: {'$set': errorMessage.error.c_password[0]}
                            }
                        }
                    });
                    console.log(options);
                    this.setState({options, value});
                });
            })
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Form 
                    ref={c => this._form = c} // assign a ref
                    type={this.User} 
                    options={this.state.options}
                    value={this.state.value}
                />
                <TouchableHighlight style={styles.button} onPress={this.handleSubmit} underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Sign Up!</Text>
                </TouchableHighlight>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff'
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