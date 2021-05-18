import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Platform } from 'react-native'
import styles from './styles'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

export default function Overlooking({  route, navigation }) {
  const treasures = route.params.treasures
  const location = route.params.location

  const initialRegion = {
    latitude : location.coords.latitude,
    longitude : location.coords.longitude,
    latitudeDelta : 0.0460,
    longitudeDelta : 0.0260,
  }

  const coordinate = {
    latitude : location.coords.latitude,
    longitude : location.coords.longitude,
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
              pinColor='blue'
              title='Now here'
            />
          {treasures.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{ latitude : marker.latitude , longitude : marker.longitude }}
              title={marker.treasureName}
              description={marker.comment}
            />
          ))}
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
              pinColor='blue'
              title='Now here'
            />
          {treasures.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{ latitude : marker.latitude , longitude : marker.longitude }}
              title={marker.treasureName}
              description={marker.comment}
            />
          ))}
        </MapView>
      </View>
      }
    </View>
  )
}