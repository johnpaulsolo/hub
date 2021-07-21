import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LocationGeofencingEventType } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { getPreciseDistance } from 'geolib';
import { Permissions } from 'expo';

// import EditScreenInfo from '../components/EditScreenInfo';
import { View } from '../components/Themed';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
import Geofence from 'react-native-expo-geofence';
import { Card, Text, Input, Button, Badge } from 'react-native-elements';
import axios from 'axios';
import { ThemeProvider } from '@react-navigation/native';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';


export default class TabOneScreen extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      userId: null,
      dropOff: '',
      address: null,
      coords: null,
      geofence: null,
      book: false,
      notes: null,
      findingRider: false,
      tripStatus: null,
      riderDetails: null,
      submitBtn: false,
      price: null,
      baseFare: 20,
      currentLocation: {
        longitude: 'unknown', //Initial Longitude
        latitude: 'unknown', //Initial Latitude
        latitudeDelta: 0.0050,
        longitudeDelta: 0.0050
      },
      region: {
        latitude: null,
        longitude: null,
        latitudeDelta: 0.0050,
        longitudeDelta: 0.0050,
      },
      dropOffLoc: {
        latitude: null,
        longitude: null,
      },
      markers: [
        {
          coordinates: {
            latitude: 14.636869,
            longitude: 120.975428,
            latitudeDelta: 0.0050,
            longitudeDelta: 0.0050,
          },
          title: "Brgy. Hub 33",
          description: "pajo - dagatdagatan"
        },
        {
          coordinates: {
            latitude: 14.632700,
            longitude: 120.974953,
            latitudeDelta: 0.0050,
            longitudeDelta: 0.0050,
          },
          title: "Brgy. Hub 34",
          description: "hermosa - abad santos"
        }
      ]
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount = async () => {

    this._isMounted = true;

    await AsyncStorage.getItem('userId').then(result => {
      result ? this.setState({ userId: result }) : this.props.navigation.navigate('Login');

      axios({
        url: 'https://serene-cliffs-80945.herokuapp.com/api',
        method: 'POST',
        data: {
          query:`
            {
              UserPendingTransactions(User:"${result}"){
                _id
                Status
              }
            }
          `
        }
      }).then( result => {
        this.setState({
          findingRider: true
        })
        this._searching(result.data.data.UserPendingTransactions._id)
      }).catch( err => {
        this.setState({
          findingRider: false
        })
      })
    })

    await navigator.geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Longitude from the location json

        const currentLatitude = JSON.stringify(position.coords.latitude);
        //getting the Latitude from the location json
        this.setState({ 
          currentLocation: {
            latitude: currentLatitude,
            longitude: currentLongitude,
            latitudeDelta: 0.0050,
            longitudeDelta: 0.0050
          },
          region: {
            longitude: currentLongitude,
            latitude: currentLatitude,
            latitudeDelta: 0.0050,
            longitudeDelta: 0.0050
          }
        });
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 1000, maximumAge: 1000 }
    );
    // this.watchID = navigator.geolocation.watchPosition(position => {
    //   //Will give you the location on location change
    //   console.log(position);
    //   const currentLongitude = JSON.stringify(position.coords.longitude);
    //   //getting the Longitude from the location json
    //   const currentLatitude = JSON.stringify(position.coords.latitude);
    //   //getting the Latitude from the location json
    //   this.setState({ 
    //     region: {
    //       longitude: currentLongitude,
    //       latitude: currentLatitude,
    //       latitudeDelta: 0.0050,
    //       longitudeDelta: 0.0050
    //     }
    //   });
    // });
    // await Location.startLocationUpdatesAsync('first task', {
    //   accuracy: Location.Accuracy.Balanced,
    // });
    // await this._geoFencing();
  };
  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.watchID);
  };

  selectTerminal = (loc) => {
    // alert(loc)
    this.setState({ region: loc })
  }

  _getByProximity()
  {
      var points = [
        { latitude: -23.658739, longitude: -46.666305 },
        { latitude: -23.651814, longitude:  -46.664129 }
      ]
      
      var startPoint = { 
          latitude: -23.652508,
          longitude: -46.661474
      }
      var maxDistanceInKM = 0.5; // 500m distance
      // startPoint - center of perimeter
      // points - array of points
      // maxDistanceInKM - max point distance from startPoint in KM's
      // result - array of points inside the max distance
      var result = Geofence.filterByProximity(startPoint, points, maxDistanceInKM);

      // You can access distance of this object in distanceInKM property
      var distance = result[0].distanceInKM;
      alert(distance);
  }

  _getAddress = async () => {
    // const { status } = await Permissions.askAsync(Permissions.LOCATION)
    const locdata = { latitude:  Number(this.state.currentLocation.latitude), longitude:  Number(this.state.currentLocation.longitude) }
    // const locdata = {latitude: 14.636869, longitude: 120.975428}
    // const location = await Location.reverseGeocodeAsync(locdata)
    // const coords = await Location.geocodeAsync("maypajo")

    let response = await Location.reverseGeocodeAsync(locdata);

    for (let item of response) {
      let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;

      this.setState({
        address: address,
        coords: locdata
      })
    }
  }

  _geoFencing = async () => {
    let regions = [{latitude: 14.636869, longitude: 120.975428, radius: 100 }]
    const geofence = await Location.startGeofencingAsync('Hub 1', regions)

    alert(JSON.stringify(geofence))
    this.setState({
      geofence: geofence
    })
  }

  _book = () => {
    axios({
      url: 'https://serene-cliffs-80945.herokuapp.com/api',
      method: 'POST',
      data: {
        query:`
          mutation{ 
            CreateTransaction(newTransaction:{
              UserId: "${this.state.userId}",
              Notes: "${this.state.notes}",
              PickAddress: "${this.state.address}",
              DropAddress: "${this.state.dropOff}",
              PickLat: ${this.state.currentLocation.latitude},
              PickLong: ${this.state.currentLocation.longitude},
              DropLat: ${this.state.dropOffLoc.latitude},
              DropLong: ${this.state.dropOffLoc.longitude},
              Status: "Pending",
              Price: ${this.state.price}
            }){
              _id
              PickLat
              PickLong
              DropLat
              DropLong
            }
          }
        `
      }
    }).then( result => {
      this.setState({
        riderDetails: null,
        tripStatus: "Pending",
        findingRider: true,
        submitBtn: false
      })
      this._searching(result.data.data.CreateTransaction._id)
    }).catch( err => {
      alert(err)
    })
  }

  _serviceFee = () => {

    let meters = getPreciseDistance( { latitude: Number(this.state.currentLocation.latitude), longitude: Number(this.state.currentLocation.longitude) },{ latitude: Number(this.state.dropOffLoc.latitude), longitude: Number(this.state.dropOffLoc.longitude) } )
    
    this.setState({
      price: Math.round((meters/1000) * 2 + this.state.baseFare)
    });
  }

  _searching = (id) => {
    axios({
      url: 'https://serene-cliffs-80945.herokuapp.com/api',
      method: 'POST',
      data: {
        query:`
          {
            Searching(TripId: "${id}"){
              _id
              Status
              Rate
              Driver {
                FName
                LName
                Phone
                Vehicle
                PlateNo
              }
            }
          }
        `
      }
    }).then(result => {

      switch (result.data.data.Searching.Status) {
        case "Accepted":
            this.setState({
              findingRider: true,
              riderDetails: {
                rName: `${result.data.data.Searching.Driver.FName} ${result.data.data.Searching.Driver.LName}`,
                plateNo: `${result.data.data.Searching.Driver.PlateNo}`,
                rPhone: `${result.data.data.Searching.Driver.Phone}`
              },
              tripStatus: result.data.data.Searching.Status
            })

            this._searching(id)
          break;
        case "Completed":
            result.data.data.Searching.Rate == null ?
              this.setState({
                findingRider: true,
                riderDetails: {
                  rName: `${result.data.data.Searching.Driver.FName} ${result.data.data.Searching.Driver.LName}`,
                  plateNo: `${result.data.data.Searching.Driver.PlateNo}`,
                  rPhone: `${result.data.data.Searching.Driver.Phone}`
                },
                tripStatus: result.data.data.Searching.Status
              })
            : 
              this.setState({
                findingRider: false
              })
          break;
        default:
            this.setState({
              findingRider: true,
              tripStatus: result.data.data.Searching.Status
            })

            this._searching(id)
          break;        
      }
  
    }).catch(err => {
      this.setState({
        findingRider: false
      })
    })
  }

  render() {
    // TODO: Payment fot google
    // const GOOGLE_MAPS_APIKEY = 'AIzaSyBotWB42sSAdM2vevI2iwuiIZ7nBMNl0BY';

    return (
      <View style={styles.container}>
        {
          this.state.region.latitude ?
            <MapView 
              region={this.state.region}
              style={styles.map} 
            >
              {/* <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={GOOGLE_MAPS_APIKEY}
              /> */}
              <MapView.Marker.Animated
                ref={marker => { this.markers = marker }}
                coordinate={this.state.markers.coordinates}
              />
                <Marker
                  coordinate={this.state.currentLocation}
                  title={'your location'}
                ></Marker>
                {this.state.book ? 
                  <Marker
                    coordinate={this.state.dropOffLoc}
                    image={require('../assets/images/loc.png')}
                    style={{width: 10, height: 10}}
                    resizeMode="contain"
                  ></Marker>
                : null}
              {/* {this.state.markers.map((marker, index) => (
                <Marker
                  key={index}
                  coordinate={marker.coordinates}
                  title={marker.title}
                  description={marker.description}
                  image={require('../assets/images/tricycle-icon-29.png')}
                  onPress={()=>getlocation(marker.title)}
                >
                </Marker>
              ))} */}
            </MapView>
          :
            <Text>Loading</Text>
        }

        {this.state.book ?
              <View style={styles.confirmation}>
                <Card>
                  <Card.Title>Confirm Pick-up and Drop off</Card.Title>
                  <Card.Divider/>
                    <Card.Title>₱ {this.state.price}</Card.Title>
                    <Badge status="primary" value={<Text style={styles.bText}>Pick Up: </Text>}/>
                    <Text style={styles.bText}>{this.state.address}</Text>
                    <Badge status="success" value={<Text style={styles.bText}>Drop Off: </Text>}/>
                    <Text style={styles.bText}>{this.state.dropOff}</Text>
                    <Input
                      placeholder='Extra Notes'
                      onChangeText={value => this.setState({ notes: value })}
                    />
                    <Button
                      disabled={this.state.submitBtn}
                      title='Book Now'
                      onPress={() => { 
                        this.setState({
                          submitBtn: true
                        }) 
                        this._book()
                      }}
                    />
                </Card>
              </View>
            :
              this.state.region.latitude ?
                <View style={styles.search}>
                  <Input
                    placeholder='Drop Off Location'
                    onChangeText={value => this.setState({ dropOff: value })}
                  />
                  <Button
                    title='search'
                    onPress={async () => {
                      // search(this.state.dropOff)
                      const coords = await Location.geocodeAsync(this.state.dropOff)

                      await coords.length === 0 ? 
                          alert('place does not exist') 
                        : this.setState({
                          region: {
                            latitude: coords[0].latitude,
                            longitude: coords[0].longitude,
                            latitudeDelta: 0.0050,
                            longitudeDelta: 0.0050,
                          },
                          dropOffLoc: {
                            latitude: coords[0].latitude,
                            longitude: coords[0].longitude
                          },
                          book: true
                        })
                      
                      await this._getAddress()
                      await this._serviceFee()
                    }}
                  />
                </View>
              : null
        }

        { this.state.findingRider ? 
            this.state.riderDetails ?
                this.state.tripStatus == "Completed" ? 
                  <View style={styles.loading}>
                    <Text h1>Successfully Completed the Trip</Text>
                    <Image
                      source={require('../assets/images/man.png')}
                    />
                    <Text h1>{this.state.riderDetails.rName}</Text>
                    <Text h1>Plate No. {this.state.riderDetails.plateNo}</Text>
                    <Button
                      title="Book Again"
                      onPress={
                        () => {
                          this.setState({
                            findingRider: null,
                            book: false
                          })
                        }
                      }
                    />
                  </View>
                  :
                  <View style={styles.loading}>
                    <Text h1>You Found a Rider</Text>
                    <Image
                      source={require('../assets/images/man.png')}
                    />
                    <Text h3>{this.state.riderDetails.rName}</Text>
                    <Text h3>Plate No. {this.state.riderDetails.plateNo}</Text>
                    <Text h5>Phone: {this.state.riderDetails.rPhone}</Text>
                    <Image
                      source={require('../assets/images/loading.gif')}
                    />
                  </View>
            :
              <View style={styles.loading}>
                <Text h1>Finding Rider</Text>
                <Image
                  source={require('../assets/images/man.png')}
                />
                <Image
                  source={require('../assets/images/loading.gif')}
                />
              </View>
          :
          null
        }
        
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
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  bottomCard: {
    position: "absolute",
    bottom: 10,
    // marginTop: 0,
    backgroundColor: 'transparent'
  },
  search: {
    width: 300,
    position: "absolute",
    top: 10,
    // marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 10
  },
  confirmation: {
    position: "absolute",
    backgroundColor: 'white',
    top: 10
  },
  loading: {
    alignItems: 'center',
    position: "absolute",
    backgroundColor: 'white',
    width: '100%',
    height: '100%'
  },
  bText: {
    color: 'black',
    textAlign: 'center'
  }
});
