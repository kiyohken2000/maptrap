import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import { Divider } from 'react-native-elements'

export default function Treasure({ route, navigation}) {
  const treasure = route.params.treasureData
  const myProfile = route.params.myProfile
  const [progress, setProgress] = useState('')
  const [treasureImage, setTreasureImage] = useState(treasure.treasureImage)

  const ImageChoiceAndUpload = async () => {
    try {
      if (Constants.platform.ios) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert("Permission is required for use.");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
          const localUri = await fetch(result.uri);
          const localBlob = await localUri.blob();
          const filename = myProfile.id + new Date().getTime()
          const storageRef = firebase.storage().ref().child("images/" + filename);
          const putTask = storageRef.put(localBlob);
          const treasureRef = firebase.firestore().collection('treasures').doc(treasure.id)
          putTask.on('state_changed', (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(parseInt(progress) + '%')
          }, (error) => {
            console.log(error);
            alert("Upload failed.");
          }, () => {
            putTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              setProgress('')
              setTreasureImage(downloadURL)
              treasureRef.update({
                'treasureImage': downloadURL
              })
            })
          })
        }
    } catch (e) {
        console.log('error',e.message);
        alert("The size may be too much.");
    }
  }

  function goMap() {
    navigation.navigate('Location', {Location: treasure})
  }

  function delTrap() {
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
        <TouchableOpacity style={styles.imagecontainer} onPress={ImageChoiceAndUpload}>
          <Image source={{uri: treasureImage}} style={styles.image}/>
        </TouchableOpacity>
        <Text style={{ alignSelf: 'center' }}>{progress}</Text>
        <Text style={styles.field}>Name:</Text>
        <Text style={styles.title}>{treasure.treasureName}</Text>
        <Text style={styles.field}>Comment:</Text>
        <Text style={styles.title}>{treasure.comment}</Text>
        <TouchableOpacity style={styles.button} onPress={goMap}>
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delbutton} onPress={delTrap}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}