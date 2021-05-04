import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Divider } from 'react-native-elements'

export default function Discover({ route, navigation}) {
  const userData = route.params.myProfile
  const treasureID = route.params.treasureID
  const [treasure, setTreasure] = useState([])

  useEffect(() => {
    const treasureRef = firebase.firestore().collection('treasures').doc(treasureID)
    treasureRef.get().then((doc) => {
      if (doc.exists) {
        treasureRef
        .onSnapshot(function(document) {
          const data = document.data()
          setTreasure(data)
        })
      } else {
        null
      }
    })
  },[])

  const getItem = () => {
    const userRef2 = firebase.firestore().collection('users2').doc(userData.email)
    const userRef = firebase.firestore().collection('users').doc(userData.id)
    userRef2.update({
      items: firebase.firestore.FieldValue.arrayUnion(treasure.id)
    })
    userRef.update({
      items: firebase.firestore.FieldValue.arrayUnion(treasure.id)
    })
    // navigation.goBack()
  }

  const report = () => {
    alert('Report has been sent.')
  }

  const block = () => {
    alert('Added to the block list.')
  }

  function goMap() {
    navigation.navigate('Location', {Location: treasure})
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
        <TouchableOpacity style={styles.get} onPress={getItem}>
          <Text style={styles.buttonText}>Get this Treasure</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goMap}>
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.block} onPress={block}>
          <Text style={styles.buttonText}>Block</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.report} onPress={report}>
          <Text style={styles.buttonText}>Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}