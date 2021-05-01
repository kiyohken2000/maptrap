import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Restart } from 'fiction-expo-restart'
import * as Location from 'expo-location'
import { Avatar } from 'react-native-elements'

export default function Profile( props ) {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const userData = props.extraData

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }
      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })();
  }, []);

  function goMap() {
    props.navigation.navigate('Map', {Data: userData, Location: location})
  }

  const signOut = () => {
    firebase.auth().signOut()
    Restart()
  }

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <ScrollView style={{ flex: 1, width: '100%' }}>
        <View>
          <View style={styles.avatar}>
            <Avatar
              size="xlarge"
              rounded
              title="NI"
              source={{ uri: userData.avatar }}
            />
          </View>
          <Text style={styles.field}>Name:</Text>
          <Text style={styles.title}>{userData.fullName}</Text>
          <Text style={styles.field}>Mail:</Text>
          <Text style={styles.title}>{userData.email}</Text>
          <Text style={styles.field}>My trap:</Text>
          {
            userData.trap.map((trap, i) => {
              return (
                <View key={i}>
                  <Text style={styles.field}>{trap}</Text>
                </View>
              )
            })
          }
          {location?
            <TouchableOpacity style={styles.button} onPress={goMap}>
              <Text style={styles.buttonText}>Map</Text>
            </TouchableOpacity>:
            <View style={styles.nonbutton}>
              <Text style={styles.buttonText}>Map</Text>
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