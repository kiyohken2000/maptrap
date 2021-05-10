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
    const treasuresRef = firebase.firestore().collection('treasures')
    treasuresRef.onSnapshot(querySnapshot => {
      const treasures = querySnapshot.docs.map(documentSnapshot => {
        const data = documentSnapshot.data()
        const e = l.includes(data.identifier)
        if ( e != true ) {
          return {
            identifier: data.identifier,
            latitude: data.latitude,
            longitude: data.longitude,
            radius: data.radius,
          };
        } else {
          return {
            identifier: 'no data',
            latitude: 37.79122481583162,
            longitude: -122.40227584211668,
            radius: data.radius,
          }
        }
      });
      setTreasures(treasures);
    });
  }

  useEffect(() => {
    const treasuresRef = firebase.firestore().collection('treasures')
    .onSnapshot(querySnapshot => {
      const treasures = querySnapshot.docs.map(documentSnapshot => {
        const data = documentSnapshot.data()
        const e = l.includes(data.identifier)
        if ( e != true ) {
          return {
            identifier: data.identifier,
            latitude: data.latitude,
            longitude: data.longitude,
            radius: data.radius,
          };
        } else {
          return {
            identifier: 'no data',
            latitude: 37.79122481583162,
            longitude: -122.40227584211668,
            radius: data.radius,
          }
        }
      });
      setTreasures(treasures);
    });
    return () => treasuresRef()
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
            {treasuresArray ?
              (scan ?
                (<TouchableOpacity onPress={stop}>
                  <Icon name="stop-circle" size={65} color="red"/>
                </TouchableOpacity>) :
                (<TouchableOpacity onPress={start}>
                  <Icon name="play-circle" size={65} color="orange"/>
                </TouchableOpacity>)
              ) :
              (null)
            }
          </View>
        </View>
      </View>
    </View>
  )
}