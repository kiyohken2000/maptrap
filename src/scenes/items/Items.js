import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Divider } from 'react-native-elements'
import * as Location from "expo-location"

export default function Items(props) {
  const userData = props.extraData
  const [theArray, setTheArray] = useState([])
  const [location, setLocation] = useState(null)
  const items = userData.items?userData.items:['F8574LKGHDWrFp8kiXSo', 'GlQXgZXkHjRS76bjVXmX']

  useEffect(() => {
    const itemsListner = () => {
      setTheArray([])
      for (const item of items) {
        const treasureRef = firebase.firestore().collection('treasures').doc(item)
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
    }
    itemsListner()
  },[userData])

  useEffect(() => {
    let unmounted = false;
    (async () => {
      let position = await Location.getCurrentPositionAsync({})
      setLocation(position)
    })();
    return () => { unmounted = true };
  },[])

  /*theArray.sort(function(a, b) {
    if (a.createdTime > b.createdTime) {
      return -1;
    } else {
      return 1;
    }
  })*/

  theArray.reverse()

  var myItems = theArray.filter(function(v1,i1,a1){ 
    return (a1.findIndex(function(v2){ 
      return (v1.id===v2.id) 
    }) === i1);
  });

  const treasureArray = myItems.filter(value => value.del != true)

  function displaytime(timestamp) {
    const time = new Date(timestamp).toISOString().substr(0, 10)
    return time
 }

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, width: '100%' }}>
        {items?<ScrollView>
          {
            treasureArray.map((item, i) => {
              return (
                <View key={i} style={styles.item}>
                  <TouchableOpacity onPress={() => props.navigation.navigate('Item', { itemData: item, myProfile: userData })}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={styles.imagecontainer}>
                        <Image source={{uri: item.treasureImage}} style={styles.image}/>
                      </View>
                      <View style={{ flex: 1, width: '100%' }}>
                        <Text style={styles.title} numberOfLines={2}>{item.treasureName}</Text>
                        <Text style={styles.comment} numberOfLines={2}>{item.comment}</Text>
                        <Text style={styles.date}>{displaytime(item.createdTime)}</Text>
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
          onPress={() => props.navigation.navigate('Overlooking', { treasures:myItems, location: location })}
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