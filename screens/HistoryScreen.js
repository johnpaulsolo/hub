import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Card, Button, Icon } from 'react-native-elements';

export default class TabTwoScreen extends Component {
  render () {
    return (
      <View style={styles.container}>

        <ScrollView>
          <Card>
            <Card.Title>Date</Card.Title>
            <Card.Divider/>
            <Card.Image source={{ uri: 'https://i.pinimg.com/originals/7c/51/98/7c5198d2a0751fa76c8433dba4a1a12a.jpg' }}/>
              <Text style={{marginBottom: 10, color: 'black'}}>
                Description of travel and location, hub used and price
              </Text>
              <Button
                icon={<Icon name='code' color='#ffffff' />}
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                title='VIEW NOW' />
          </Card>

          <Card>
            <Card.Title>Date</Card.Title>
            <Card.Divider/>
            <Card.Image source={{ uri: 'https://i.pinimg.com/originals/7c/51/98/7c5198d2a0751fa76c8433dba4a1a12a.jpg' }}/>
              <Text style={{marginBottom: 10, color: 'black'}}>
                Description of travel and location, hub used and price
              </Text>
              <Button
                icon={<Icon name='code' color='#ffffff' />}
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                title='VIEW NOW' />
          </Card>

          <Card>
            <Card.Title>Date</Card.Title>
            <Card.Divider/>
            <Card.Image source={{ uri: 'https://i.pinimg.com/originals/7c/51/98/7c5198d2a0751fa76c8433dba4a1a12a.jpg' }}/>
              <Text style={{marginBottom: 10, color: 'black'}}>
                Description of travel and location, hub used and price
              </Text>
              <Button
                icon={<Icon name='code' color='#ffffff' />}
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                title='VIEW NOW' />
          </Card>
        </ScrollView>
        {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="/screens/TabTwoScreen.tsx" /> */}
      </View>
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
