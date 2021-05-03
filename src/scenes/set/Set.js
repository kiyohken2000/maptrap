import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, TouchableOpacity } from 'react-native'
import styles from './styles'
import { Divider, Avatar } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Input } from 'galio-framework'
import { firebase } from '../../../firebase'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'

export default function Set({ route, navigation }) {
  const data = route.params.Data
  const region = route.params.Location
  const [treasureName, setTreasureName] = useState('')
  const [comment, setComment] = useState('')
  const [progress, setProgress] = useState('')
  const [treasureImage, setTreasureImage] = useState('https://firebasestorage.googleapis.com/v0/b/maptrap.appspot.com/o/logo.jpg?alt=media&token=4ebae158-5b7d-4ca9-b244-21c597c8f5b4')

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
          const filename = data.id + new Date().getTime()
          const storageRef = firebase.storage().ref().child("images/" + filename);
          const putTask = storageRef.put(localBlob);
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
            })
          })
        }
    } catch (e) {
        console.log('error',e.message);
        alert("The size may be too much.");
    }
  }

  function setTreasure() {
    const treasureRef = firebase.firestore().collection('treasures').doc()
    treasureRef.set({
      identifier: treasureRef.id,
      radius: 200,
      id: treasureRef.id,
      treasureName: treasureName,
      comment: comment,
      latitude: region.latitude,
      longitude: region.longitude,
      createdTime: new Date().getTime(),
      createrEmail: data.email,
      createrId: data.id,
      treasureImage: treasureImage
    })
    const userRef1 = firebase.firestore().collection('users').doc(data.id)
    userRef1.update({
      treasure: firebase.firestore.FieldValue.arrayUnion(treasureRef.id)
    })
    const userRef2 = firebase.firestore().collection('users2').doc(data.email)
    userRef2.update({
      treasure: firebase.firestore.FieldValue.arrayUnion(treasureRef.id)
    })
    setTreasureName('')
    setComment('')
  }
  
  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, width: '100%' }}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <View style={styles.container}>
            <TouchableOpacity style={styles.imagecontainer} onPress={ImageChoiceAndUpload}>
              <Image source={{uri: treasureImage}} style={styles.image}/>
            </TouchableOpacity>
            <Text style={styles.description}>Treasure Image</Text>
            <Text style={styles.description}>(tap and change image)</Text>
            <Text style={{ alignSelf: 'center' }}>{progress}</Text>
            <View style={styles.regionContainer}>
              <Text style={styles.description}>Coordinate</Text>
              <Text style={styles.coordinate}>{region.latitude}</Text>
              <Text style={styles.coordinate}>{region.longitude}</Text>
            </View>
            <Text>Treasure Name</Text>
            <Input
              name='name'
              placeholder="Treasure name"
              rounded
              onChangeText={(text) => setTreasureName(text)}
              value={treasureName}
            />
            <Text>Comments</Text>
            <Input
              name='comment'
              style={{height:150}}
              placeholder="your comment"
              rounded
              multiline
              onChangeText={(text) => setComment(text)}
              value={comment}
            />
            <View style={styles.buttonContainer}>
              {comment?<TouchableOpacity style={styles.tbutton} onPress={setTreasure}>
                <Text style={styles.buttonText}>Set</Text>
              </TouchableOpacity>:
              <View style={styles.nonbutton}>
                <Text style={styles.buttonText}>Set</Text>
              </View>}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  )
}