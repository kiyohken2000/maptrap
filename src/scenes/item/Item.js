import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Divider, Avatar } from 'react-native-elements'

export default function Item({ route, navigation }) {
  const userData = route.params.myProfile
  const item = route.params.itemData
  const [user, setUser] = useState([])

  useEffect(() => {
    const treasureRef = firebase.firestore().collection('users2').doc(item.createrEmail)
    treasureRef.get().then((doc) => {
      if (doc.exists) {
        treasureRef
        .onSnapshot(function(document) {
          const data = document.data()
          setUser(data)
        })
      } else {
        null
      }
    })
  },[])

  function goMap() {
    navigation.navigate('Location', {Location: item})
  }

  function dump() {
    const userRef2 = firebase.firestore().collection('users2').doc(userData.email)
    const userRef = firebase.firestore().collection('users').doc(userData.id)
    userRef2.update({
      items: firebase.firestore.FieldValue.arrayRemove(item.id)
    })
    userRef.update({
      items: firebase.firestore.FieldValue.arrayRemove(item.id)
    })
    navigation.goBack()
  }

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <ScrollView style={{ flex: 1, width: '100%' }}>
        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.avatar}>
            <Avatar
              size="large"
              rounded
              title="NI"
              source={{ uri: user.avatar }}
            />
          </View>
          <View>
            <Text style={styles.filed}>Created by:</Text>
            <Text style={styles.title} numberOfLines={1}>{user.fullName}</Text>
          </View>
        </View>
        <View style={styles.imagecontainer}>
          <Image source={{uri: item.treasureImage}} style={styles.image}/>
        </View>
        <Text style={styles.field}>Name:</Text>
        <Text style={styles.title}>{item.treasureName}</Text>
        <Text style={styles.field}>Comment:</Text>
        <Text style={styles.title}>{item.comment}</Text>
        <TouchableOpacity style={styles.button} onPress={goMap}>
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dumpbutton} onPress={dump}>
          <Text style={styles.buttonText}>Dump</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}