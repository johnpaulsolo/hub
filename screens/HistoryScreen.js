import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Card, Button, Icon } from 'react-native-elements';
import axios from 'axios';

export default class TabTwoScreen extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      history: []
    }
  }

  componentDidMount = async () => {
    await AsyncStorage.getItem('userId').then(result => {
      result ? this.setState({ userId: result }) : this.props.navigation.navigate('Login');

      axios({
        url: 'https://serene-cliffs-80945.herokuapp.com/api',
        method: 'POST',
        data: {
          query:`
            {
              ProfileTransaction(User:"${result}"){
                Notes
                Status
                DropAddress
                PickAddress
                Driver{
                  FName
                  LName
                  Vehicle
                  PlateNo
                }
              }
            }
          `
        }
      }).then( result => {
        this.setState({
          history: result.data.data.ProfileTransaction
        })
      }).catch( err => {
        alert(err)
      })
    })
  }

  render () {
    return (
      <ScrollView>
        <View style={styles.container}>
            {
              this.state.history.map(result => {
                  return(
                      <Card>
                        <Card.Title>{ result.Status }</Card.Title>
                        <Card.Divider/>
                        <Text style={{marginBottom: 10, color: 'black'}}>
                          Location: { result.PickAdress }
                        </Text>
                        <Text style={{marginBottom: 10, color: 'black'}}>
                          Drop Off: { result.DropAddress }
                        </Text>
                        <Text style={{marginBottom: 10, color: 'black'}}>
                          Notes: { result.Notes }
                        </Text>
                        {
                          result.Driver ?
                            <Card>
                              <Text style={{marginBottom: 10, color: 'black'}}>
                                Driver Name: { result.Driver.FName } { result.Driver.LName }
                              </Text>
                              <Text style={{marginBottom: 10, color: 'black'}}>
                                Plate No: { result.Driver.PlateNo }
                              </Text>
                              <Text style={{marginBottom: 10, color: 'black'}}>
                                Vehicle: { result.Driver.Vehicle }
                              </Text>
                            </Card>
                          : null
                        }
                      </Card>
                  )
              })
            }
          {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          <EditScreenInfo path="/screens/TabTwoScreen.tsx" /> */}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
