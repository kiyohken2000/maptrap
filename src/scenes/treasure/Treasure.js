import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Divider, Avatar } from 'react-native-elements'

export default function Treasure({ route, navigation}) {
  const treasure = route.params.treasureData
  const myProfile = route.params.myProfile
  const picked = treasure.picked?treasure.picked:[myProfile.email]
  const [theArray, setTheArray] = useState([])

  useEffect(() => {
    const treasureListner = () => {
      setTheArray([])
      for (const u of picked) {
        const usersRef = firebase.firestore().collection('users2').doc(u)
        usersRef.get().then((doc) => {
          if (doc.exists) {
            usersRef
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
    treasureListner()
  },[])

  theArray.reverse()

  const n = theArray.length

  function goMap() {
    navigation.navigate('Location', {Location: treasure})
  }

  function delTreasure() {
    const userRef2 = firebase.firestore().collection('users2').doc(myProfile.email)
    const userRef = firebase.firestore().collection('users').doc(myProfile.id)
    const treasureRef = firebase.firestore().collection('treasures').doc(treasure.id)
    userRef2.update({
      treasure: firebase.firestore.FieldValue.arrayRemove(treasure.id)
    })
    userRef.update({
      treasure: firebase.firestore.FieldValue.arrayRemove(treasure.id)
    })
    treasureRef.set({ del: true }, {merge: true}).then(() => {
        console.log('delete')
    }).catch(error => {
        console.log(error)
    })
    navigation.goBack()
  }

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <ScrollView style={{ flex: 1, width: '100%' }}>
        <View style={styles.imagecontainer}>
          <Image source={{uri: treasure.treasureImage}} style={styles.image}/>
        </View>
        <Text style={styles.field}>Name:</Text>
        <Text style={styles.title}>{treasure.treasureName}</Text>
        <Text style={styles.field}>Comment:</Text>
        <Text style={styles.title}>{treasure.comment}</Text>
        {treasure.extraComment?
          <>
            <Text style={styles.field}>Extra Comment:</Text>
            <Text style={styles.title}>{treasure.extraComment}</Text>
          </>:null
        }
        <TouchableOpacity style={styles.button} onPress={goMap}>
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delbutton} onPress={delTreasure}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <Divider />
        <Text style={styles.picked}>Picked up users: {n}</Text>
        {
          theArray.map((u, i) => {
            return (
              <View key={i} style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={styles.avatar}>
                  <Avatar
                    size="large"
                    rounded
                    title="NI"
                    source={{ uri: u.avatar }}
                  />
                </View>
                  <Text style={styles.title} numberOfLines={1}>{u.fullName}</Text>
              </View>
            )
          })
        }
      </ScrollView>
    </View>
  )
}