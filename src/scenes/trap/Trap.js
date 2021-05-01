import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Divider } from 'react-native-elements'

export default function Trap({ route, navigation}) {
  const trap = route.params.trapData
  const userData = route.params.myProfile

  function goMap() {
    navigation.navigate('Location', {Location: trap})
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
      </View>
    </View>
  )
}