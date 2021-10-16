import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Input, Card } from 'react-native-elements';

import axios from 'axios';

class Registration extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            fname: '',
            lname: '',
            email: '',
            phone: '',
            loading: false
        }
    }

    render() { 
        const { 
            username, 
            password,
            fname,
            lname,
            email,
            phone,
            loading
        } = this.state;

        return ( 
            <View style={styles.container}>
                {
                    loading ? 
                        <Card><ActivityIndicator></ActivityIndicator></Card> 
                    : 
                        <View>
                            <Input 
                                label="First Name"
                                onChangeText={(fname) => this.setState({fname: fname})}
                                placeholder="First Name"
                                value={fname} />
                            <Input 
                                label="Last Name" 
                                onChangeText={(lname) => this.setState({lname: lname})}
                                placeholder="Last Name"
                                value={lname} />
                            <Input 
                                label="Email"
                                onChangeText={(email) => this.setState({email: email})}
                                placeholder="Email"
                                value={email} />
                            <Input 
                                label="Phone"
                                onChangeText={(phone) => this.setState({phone: phone})}
                                placeholder="09XX XXXX XXXX"
                                value={phone} />
                            <Input 
                                label="Password"
                                onChangeText={(password) => this.setState({password: password})}
                                placeholder="Password"
                                secureTextEntry
                                value={password} />
                            <Input
                                label="Username"
                                onChangeText={(username) => this.setState({username: username})}
                                placeholder="Username"
                                value={username}
                            />

                            <Button
                                buttonStyle={{backgroundColor: '#e64343'}}
                                title="Sign Up"
                                onPress={this._signup}
                            />

                            <Button
                                type="clear"
                                title="Back"
                                onPress={() => this.props.navigation.navigate('Login')}
                            />
                        </View>
                }
            </View>
        );
    }

    _signup = async () => {
        await this.setState({
            loading: true
        });

        await axios({
            method: 'POST',
            url: 'https://serene-cliffs-80945.herokuapp.com/api',
            data: {
                query: `
                    mutation {
                        CreateAccount(newAccount: {
                            Username: "${this.state.username}",
                            Email: "${this.state.email}",
                            FName: "${this.state.fname}",
                            LName: "${this.state.lname}",
                            Password: "${this.state.password}",
                            Phone: "${this.state.phone}"
                            UserType: "client"
                        }){
                            _id
                            Username
                        }
                    }
                `
            }
        }).then(result => {
            this.props.navigation.navigate('Success');
        }).catch(err => {
                this.setState({
                    loading: false
                });
                alert(err)
            }
        );
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        margin: 15
    },
    input: {
        borderBottomColor: "black",
        borderBottomWidth: 1
    }
})

export default Registration;