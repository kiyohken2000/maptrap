import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Divider, Avatar } from 'react-native-elements'
import * as Location from "expo-location"

export default function Home(props) {
  const [theArray, setTheArray] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)
  const [location, setLocation] = useState(null)
  const userData = props.extraData
  const treasures = userData.treasure?userData.treasure:['8WyBRI10fj80tjgVUXUd', 'KKOq3faOBaZSA2hNUZ6l']

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
    })();
  },[])

  useEffect(() => {
    let unmounted = false;
    (async () => {
      let position = await Location.getCurrentPositionAsync({})
      setLocation(position)
    })();
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
        {location?
        <TouchableOpacity
          style={styles.overlooking}
          onPress={() => props.navigation.navigate('Overlooking', { treasures: myTreasure, location: location })}
        >
          <Text style={styles.buttonTitle}>Overlooking</Text>
        </TouchableOpacity>:
        <View style={styles.disableoverlooking}>
        <Text style={styles.buttonTitle}>Overlooking</Text>
        </View>}
      </View>
    </View>
  )
}