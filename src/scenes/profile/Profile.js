import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Restart } from 'fiction-expo-restart'
import * as Location from 'expo-location'
import { Avatar } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import { Input, Toast } from 'galio-framework'

export default function Profile( props ) {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [isShow, setShow] = useState(false)
  const [fullName, setFullName] = useState(props.extraData.fullName)
  const [progress, setProgress] = useState('')
  const [avatar, setAvatar] = useState(props.extraData.avatar)
  const userData = props.extraData

  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })();
  }, []);

  function hideToast() {
    setShow(false)
  }

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
          const filename = userData.id + new Date().getTime()
          const storageRef = firebase.storage().ref().child("avatar/" + filename);
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
              setAvatar(downloadURL)
            })
          })
        }
    } catch (e) {
        console.log('error',e.message);
        alert("The size may be too much.");
    }
  }

  const profileUpdate = () => {
    setShow(true)
    const data = {
      id: userData.id,
      email: userData.email,
      fullName: fullName,
      avatar: avatar,
    }
    const userRef2 = firebase.firestore().collection('users2').doc(userData.email)
    userRef2.update(data)
    const userRef = firebase.firestore().collection('users').doc(userData.id)
    userRef.update(data)
    setTimeout(hideToast, 2000)
  }

  function goMap() {
    if (userData.treasure != undefined) {
      const treasureNum = userData.treasure.length
      if (treasureNum < 10) {
        props.navigation.navigate('Map', {Data: userData, Location: location})
      } else {
        alert('The maximum number of treasures that can be placed is 10.')
      }
    } else {
      props.navigation.navigate('Map', {Data: userData, Location: location})
    }
  }

  const signOut = () => {
    firebase.auth().signOut()
    Restart()
  }

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <ScrollView style={{ flex: 1, width: '100%' }}>
        <Toast isShow={isShow} positionIndicator="center" color="#f0f8ff" round={true}>
          <Text style={styles.toastText}>Profile update</Text>
        </Toast>
        <View>
          <View style={styles.avatar}>
            <Avatar
              size="xlarge"
              rounded
              title="NI"
              source={{ uri: avatar }}
              onPress={ImageChoiceAndUpload}
            />
          </View>
          <Text style={{ alignSelf: 'center' }}>{progress}</Text>
          <Text style={styles.field}>Name:</Text>
          <View style={styles.input}>
            <Input
              name='name'
              placeholder={fullName}
              rounded
              onChangeText={(text) => setFullName(text)}
              value={fullName}
          />
          </View>
          <Text style={styles.field}>Mail:</Text>
          <Text style={styles.title}>{userData.email}</Text>
          <TouchableOpacity style={styles.pbutton} onPress={profileUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          {location?
            <TouchableOpacity style={styles.button} onPress={goMap}>
              <Text style={styles.buttonText}>Map</Text>
            </TouchableOpacity>:
            <View style={styles.nonbutton}>
              <Text style={styles.buttonText}>Waiting...</Text>
            </View>
          }
          <View style={styles.footerView}>
            <Text onPress={signOut} style={styles.footerLink}>Sign out</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}