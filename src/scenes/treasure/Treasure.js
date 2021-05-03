import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'

export default function Treasure({ route, navigation}) {
  const treasure = route.params.treasureData
  const myProfile = route.params.myProfile

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
    treasureRef.delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
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
        <TouchableOpacity style={styles.button} onPress={goMap}>
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delbutton} onPress={delTreasure}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}