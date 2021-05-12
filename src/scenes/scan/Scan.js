import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { firebase } from '../../../firebase'
import * as Location from "expo-location"
import * as TaskManager from 'expo-task-manager'
import * as Notifications from 'expo-notifications'
import Icon from 'react-native-vector-icons/Feather'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask("test", ({ data: { eventType, region }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  if (eventType === Location.LocationGeofencingEventType.Enter) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Discovering!!!',
        body: 'Tap to get it.',
        data: { message: 'geofence notification message', id: region.identifier, type: 'local' },
      },
      trigger: null //{ seconds: 1 }
    });
  }
});

export default function Scan(props) {
  const [location, setLocation] = useState(null)
  const [treasuresArray, setTreasures] = useState([])
  const [scan, setScan] = useState(false)
  const userData = props.extraData
  const t = userData.treasure?userData.treasure:['D3N1apQknuBQX51MxFmG']
  const i = userData.items?userData.items:['D3N1apQknuBQX51MxFmG']
  const b = userData.block?userData.block:['D3N1apQknuBQX51MxFmG']
  const l = t.concat(i, b)

  Notifications.addNotificationResponseReceivedListener(e => {
    if (e.notification.request.content.data.type === 'local') {
      const treasureID = e.notification.request.content.data.id
      props.navigation.navigate('Discover', { treasureID: treasureID, myProfile: userData })
    } else { 
      props.navigation.navigate('Scan')
     }
  });

  async function start() {
    setScan(true)
    await get()
    const arry = treasuresArray
    console.log('start scan')
    console.log(treasuresArray)
    Location.startGeofencingAsync("test", arry);
  }

  function stop() {
    console.log('stop scan')
    setScan(false)
    Location.stopGeofencingAsync("test")
  }

  async function get() {
    (async () => {
      let position = await Location.getCurrentPositionAsync({})
      let p = location ? location : position
      await firebase.firestore().collection('treasures')
      .onSnapshot(querySnapshot => {
        const treasures = querySnapshot.docs.map(documentSnapshot => {
          const data = documentSnapshot.data()
          const e = l.includes(data.identifier)
          const lttd = p.coords.latitude - data.latitude
          const lngtd = p.coords.longitude - data.longitude
          if ( e != true && -0.1 <= lttd && lttd <= 0.1 && -0.1 <= lngtd && lngtd <= 0.1 ) {
            return {
              identifier: data.identifier,
              latitude: data.latitude,
              longitude: data.longitude,
              radius: data.radius,
            };
          } else {
            return
          }
        });
        const y = treasures.filter(v => !!v)
        setTreasures(y);
      });
    })();
  }

  useEffect(() => {
    (async () => {
      let position = await Location.getCurrentPositionAsync({})
      setLocation(position)
    })();
  },[])

  useEffect( () => {
    console.log("watch")
    const startWatching = async () => {
      await Location.startLocationUpdatesAsync( YOUR_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        deferredUpdatesInterval: 10000,
        distanceInterval: 10
      });
    };
    startWatching()
  },[]);

  useEffect(() => {
    async function getLocationAsync() {
      let isGeofencing = await Location.hasStartedGeofencingAsync("test");
      console.log(isGeofencing)
      if (!isGeofencing) {
        setScan(false)
      } else {
        setScan(true)
      }
    }
    getLocationAsync();
  }, []);

  const YOUR_TASK_NAME = "BACKGROUND_location"
  TaskManager.defineTask(YOUR_TASK_NAME, ({ data: { locations }, error }) => {
    if (error) {
      // check `error.message` for more details.
      return;
    }
    setLocation(locations[0])
  });

  const initialRegion = {
    latitude : location ? location.coords.latitude : 35.67594029207871,
    longitude : location ? location.coords.longitude : 139.74487945765574,
    latitudeDelta : 0.0460,
    longitudeDelta : 0.0260,
  }

  const coordinate = {
    latitude : location ? location.coords.latitude : 35.67594029207871,
    longitude : location ? location.coords.longitude : 139.74487945765574,
  }

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
    {location ?
    (
      Platform.OS === 'ios'?
        <View style={styles.mapcontainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
          >
            <Marker
              coordinate={coordinate}
              pinColor='blue'
              title='Current position'
            />
            {treasuresArray.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{ latitude : marker.latitude , longitude : marker.longitude }}
              />
            ))}
          </MapView>
        </View>:
        <View style={styles.androidmapcontainer}>
          <MapView
            style={styles.android}
            initialRegion={initialRegion}
            provider={PROVIDER_GOOGLE}
          >
            <Marker
              coordinate={coordinate}
              pinColor='blue'
              title='Current position'
            />
            {treasuresArray.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{ latitude : marker.latitude , longitude : marker.longitude }}
              />
            ))}
          </MapView>
        </View>
    ) :
    (<View>
      <Text>Loading...</Text>
    </View>)
    }
    <View style={styles.Overlay}>
        <View style={{ flexDirection: 'row'}}>
          <View style={{ position: 'absolute', right: 0, alignSelf:'center' }}>
            {location ?
              (scan ?
                (<TouchableOpacity onPress={stop}>
                  <Icon name="stop-circle" size={65} color="red"/>
                </TouchableOpacity>) :
                (<TouchableOpacity onPress={start}>
                  <Icon name="play-circle" size={65} color="orange"/>
                </TouchableOpacity>)
              ) :
              (<View style={{opacity:0.1}}>
                <Icon name="play-circle" size={65} color="orange"/>
              </View>)
            }
          </View>
        </View>
      </View>
    </View>
  )
}