import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Divider, Avatar } from 'react-native-elements'
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

export default function Home(props) {
  const [theArray, setTheArray] = useState([])
  const [treasuresArray, setTreasures] = useState([])
  const [scan, setScan] = useState(false)
  const [location, setLocation] = useState(null)
  const userData = props.extraData
  const treasures = userData.treasure?userData.treasure:['8WyBRI10fj80tjgVUXUd', 'KKOq3faOBaZSA2hNUZ6l']
  const t = userData.treasure?userData.treasure:['D3N1apQknuBQX51MxFmG']
  const i = userData.items?userData.items:['D3N1apQknuBQX51MxFmG']
  const b = userData.block?userData.block:['D3N1apQknuBQX51MxFmG']
  const l = t.concat(i, b)

  Notifications.addNotificationResponseReceivedListener(e => {
    if (e.notification.request.content.data.type === 'local') {
      const treasureID = e.notification.request.content.data.id
      props.navigation.navigate('Discover', { treasureID: treasureID, myProfile: userData })
    } else { 
      props.navigation.navigate('Home')
     }
  });

  function start() {
    setScan(true)
    get()
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
      let p = location?location:position
      // console.log('position',position)
      // console.log('location',location)
      await firebase.firestore().collection('treasures')
      .onSnapshot(querySnapshot => {
        // console.log('p',p)
        const treasures = querySnapshot.docs.map(documentSnapshot => {
          const data = documentSnapshot.data()
          const e = l.includes(data.identifier)
          const lttd = p.coords.latitude - data.latitude
          const lngtd = p.coords.longitude - data.longitude
          if ( e != true && -0.05 <= lttd && lttd <= 0.05 && -0.05 <= lngtd && lngtd <= 0.05 ) {
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
  }, [] );

  useEffect(() => {
    async function getLocationAsync() {
      let isGeofencing = await Location.hasStartedGeofencingAsync("test");
      console.log(isGeofencing)
      if (isGeofencing) {
        setScan(false)
      } else {
        setScan(true)
      }
    }
    getLocationAsync();
  }, []);

  const YOUR_TASK_NAME = "BACKGROUND_location"
  let clocation = null
  TaskManager.defineTask(YOUR_TASK_NAME, ({ data: { locations }, error }) => {
    if (error) {
      // check `error.message` for more details.
      return;
    }
    setLocation(locations[0])
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let bg = await Location.requestBackgroundPermissionsAsync();
      if (bg.status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let position = await Location.getCurrentPositionAsync({})
      setLocation(position)
    })();
  },[])

  useEffect(() => {
    let unmounted = false;
    get()
    return () => { unmounted = true };
  },[])

  useEffect(() => {
    setTheArray([])
    for (const treasure of treasures) {
      const treasureRef = firebase.firestore().collection('treasures').doc(treasure)
      treasureRef.get().then((doc) => {
        if (doc.exists) {
          treasureRef
          .onSnapshot(function(document) {
            const data = document.data()
            setTheArray(oldArray => [...oldArray, data])
          })
        } else {
          null
        }
      })
    }
  },[])

  theArray.sort(function(a, b) {
    if (a.createdTime > b.createdTime) {
      return -1;
    } else {
      return 1;
    }
  })

  var myTreasure = theArray.filter(function(v1,i1,a1){ 
    return (a1.findIndex(function(v2){ 
      return (v1.id===v2.id) 
    }) === i1);
  });

  function displaytime(timestamp) {
    const time = new Date(timestamp).toISOString().substr(0, 10)
    return time
 }

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, width: '100%' }}>
        {treasures?<ScrollView>
          {
            myTreasure.map((treasure, i) => {
              return (
                <View key={i} style={styles.item}>
                  <TouchableOpacity onPress={() => props.navigation.navigate('Treasure', { treasureData: treasure, myProfile: userData })}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={styles.imagecontainer}>
                        <Image source={{uri: treasure.treasureImage}} style={styles.image}/>
                      </View>
                      <View style={{ flex: 1, width: '100%' }}>
                        <Text style={styles.title} numberOfLines={2}>{treasure.treasureName}</Text>
                        <Text style={styles.comment} numberOfLines={2}>{treasure.comment}</Text>
                        <Text style={styles.date}>{displaytime(treasure.createdTime)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Divider />
                </View>
              )
            })
          }
        </ScrollView>:
        <Text>No data</Text>}
      </View>
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