import React from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Restart } from 'fiction-expo-restart'

export default function Profile( props ) {
  const userData = props.extraData

  const signOut = () => {
    firebase.auth().signOut()
    Restart()
  }

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <Text>{userData.email}</Text>
      <View style={styles.footerView}>
        <Text onPress={signOut} style={styles.footerLink}>Sign out</Text>
      </View>
    </View>
  )
}