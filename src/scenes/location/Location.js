import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Platform } from 'react-native'
import styles from './styles'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

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
      {Platform.OS === 'ios'?
      <View style={styles.mapcontainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
        >
          <Marker
            coordinate={coordinate}
            title={location.treasureName}
            description={location.comment}
          />
        </MapView>
      </View>:
      <View style={styles.androidmapcontainer}>
        <MapView
          style={styles.android}
          initialRegion={initialRegion}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={coordinate}
            title={location.treasureName}
            description={location.comment}
          />
        </MapView>
      </View>
      }
    </View>
  )
}