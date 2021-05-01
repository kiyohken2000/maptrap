import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Divider } from 'react-native-elements'

export default function Trap({ route, navigation}) {
  const trap = route.params.trapData
  const myProfile = route.params.myProfile

  function goMap() {
    navigation.navigate('Location', {Location: trap})
  }

  function delTrap() {
    const userRef2 = firebase.firestore().collection('users2').doc(myProfile.email)
    const userRef = firebase.firestore().collection('users').doc(myProfile.id)
    const trapRef = firebase.firestore().collection('trap').doc(trap.id)
    userRef2.update({
      trap: firebase.firestore.FieldValue.arrayRemove(trap.id)
    })
    userRef.update({
      trap: firebase.firestore.FieldValue.arrayRemove(trap.id)
    })
    trapRef.delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    })
    navigation.goBack()
  }

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, width: '100%' }}>
        <Text style={styles.field}>Name:</Text>
        <Text style={styles.title}>{trap.trapName}</Text>
        <Text style={styles.field}>Comment:</Text>
        <Text style={styles.title}>{trap.comment}</Text>
        <TouchableOpacity style={styles.button} onPress={goMap}>
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delbutton} onPress={delTrap}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}