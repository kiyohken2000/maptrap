import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import { Divider } from 'react-native-elements'

export default function Items(props) {
  const userData = props.extraData

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <View style={{ flex: 1, width: '100%' }}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Item', { myProfile: userData })}>
          <Text>go to item</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('Discover')}>
          <Text>go to discover</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}