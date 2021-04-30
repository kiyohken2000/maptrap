import React from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'

export default function Home({ route, navigation }) {

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <Text>Home screen</Text>
    </View>
  )
}