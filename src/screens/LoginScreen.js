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
        this.state = {
            user: {}
        };

        this.User = t.struct({
            email: t.String,
            username: t.String,
            password: t.String,
            c_password: t.String,
            terms: t.Boolean
        });

        this.options = {
            fields: {
                c_password: {
                    label: 'Confirm your password',
                    password: true,
                    secureTextEntry: true,
                },
                password: {
                    password: true,
                    secureTextEntry: true,
                },
                terms: {
                    label: 'Agree to terms',
                },
            },  
        };

        this.validate = null;
    }
    static navigationOptions = {
        title: 'PROFILE',
    }
    handleSubmit = () => {
        const {navigate} = this.props.navigation;
        const value = this._form.getValue(); // use that ref to get the form value
        if (value) {
            this.setState({
                options: t.update(this.state.options, {
                  fields: {
                    username: {
                      editable: {'$set': false}
                    },
                    password: {
                      editable: {'$set': false},
                      hasError: {'$set': false},
                      error: {'$set': null}
                    },
                    email: {
                        editable: {'$set': false}
                    },
                    c_password: {
                      editable: {'$set': false},
                    }
                  }
                })
              });
            fetch('https://limitless-springs-83583.herokuapp.com/api/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(value),
            })
            .then( response => {
                if (!response.ok) { throw response }
                return response.json()  //we only get here if there is no error
            })
            .then( json => {
                console.log(json);
                this.props.dispatch(doSomethingWithResult(json)) 
            })
            .catch( err => {
                err.text().then( errorMessage => {
                    this.setState({
                        options: t.update(this.state.options, {
                          fields: {
                            username: {
                              editable: {'$set': true}
                            },
                            password: {
                              editable: {'$set': true},
                              hasError: {'$set': true},
                              error: {'$set': 'Server error!'}
                            }
                          }
                        })
                      });
                    console.log(errorMessage);
                    alert(errorMessage);
                })
            })
        }
    }

    onChange(value) {
        this.setState({value});
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Form 
                    ref={c => this._form = c} // assign a ref
                    type={this.User} 
                    options={this.options}
                    value={this.state.value}
                    onChange={this.onChange}
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
        justifyContent: 'center',
        marginTop: 50,
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