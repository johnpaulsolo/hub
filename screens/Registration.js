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
                        </View>
                }
            </View>
        );
    }

    _signin = async () => {
        await this.setState({
            loading: true
        });

        await axios({
            method: 'POST',
            url: 'https://serene-cliffs-80945.herokuapp.com/api',
            data: {
                query: `
                    {
                        login( Username: "${this.state.username}" Password: "${this.state.password}"){
                            userId
                            token
                            tokenExpiration
                            userType
                        }
                    }
                `
            }
        }).then(result => {
            AsyncStorage.setItem('userId', result.data.data.login.userId);
            AsyncStorage.setItem('userType', result.data.data.login.userType);

            this.props.navigation.navigate('Root');
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