import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Divider } from 'react-native-elements'

export default function Home(props) {
  const [theArray, setTheArray] = useState([])
  const userData = props.extraData
  const traps = userData.trap

  useEffect(() => {
    setTheArray([])
    for (const trap of traps) {
      const trapRef = firebase.firestore().collection('trap').doc(trap)
      trapRef.get().then((doc) => {
        if (doc.exists) {
          trapRef
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

  var myTraps = theArray.filter(function(v1,i1,a1){ 
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
        <ScrollView>
          {
            myTraps.map((trap, i) => {
              return (
                <View key={i} style={styles.item}>
                  <TouchableOpacity onPress={() => props.navigation.navigate('Trap', { trapData: trap, myProfile: userData })}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{ flex: 1, width: '100%' }}>
                        <Text style={styles.title} numberOfLines={1}>{trap.trapName}</Text>
                        <Text style={styles.comment} numberOfLines={1}>{trap.comment}</Text>
                        <Text style={styles.date}>{displaytime(trap.createdTime)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Divider />
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    </View>
  )
}