import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Divider, Avatar } from 'react-native-elements'
import * as Location from "expo-location"
import * as TaskManager from 'expo-task-manager'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask("test", ({ data: { eventType, region }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  if (eventType === Location.LocationGeofencingEventType.Enter) {
    console.log("You've entered region:", region);
    /*alert(`in ${region.identifier}`)*/
    Notifications.scheduleNotificationAsync({
      content: {
        title: region.identifier,
        body: 'Entry my geofence',
        data: { message: 'geofence notification message', id: region.identifier },
      },
      trigger: null //{ seconds: 1 }
    });
  }
});

export default function Home(props) {
  const [theArray, setTheArray] = useState([])
  const [treasuresArray, setTreasures] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)
  const userData = props.extraData
  const treasures = userData.treasure?userData.treasure:['8mCYBSAT5hikQmZzNKtg']

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(e => {
      const treasureID = e.notification.request.content.data.id
      props.navigation.navigate('Discover', { treasureID: treasureID, myProfile: userData })
    })
    subscription.remove();
    (async () => {
      const treasuresRef = firebase.firestore().collection('treasures')
      treasuresRef
      .onSnapshot(querySnapshot => {
        const treasures = querySnapshot.docs.map(documentSnapshot => {
          const data = documentSnapshot.data()
          return {
            identifier: data.identifier,
            latitude: data.latitude,
            longitude: data.longitude,
            radius: data.radius,
          };
        });
        setTreasures(treasures);
        console.log(treasuresArray)
      });
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
      await Location.startGeofencingAsync("test", treasuresArray, );
    })();
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
    </View>
  )
}