import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import MapView, { Marker } from 'react-native-maps'
import Trap from '../trap'

export default function Location({  route, navigation }) {
  const location = route.params.Location

  const initialRegion = {
    latitude : location.latitude,
    longitude : location.longitude,
    latitudeDelta : 0.0460,
    longitudeDelta : 0.0260,
  }

  const coordinate = {
    latitude : location.latitude,
    longitude : location.longitude,
  }

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <View style={styles.mapcontainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          <Marker
            coordinate={coordinate}
            title={location.trapName}
            description={location.comment}
          />
        </MapView>
      </View>
    </View>
  )
}