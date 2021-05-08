import React, { useState, useEffect } from 'react'
import { View, StatusBar, Platform } from 'react-native'
import styles from './styles'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

export default function Map({ route, navigation }) {
  const data = route.params.Data
  const location = route.params.Location.coords
  const [region, setRegion] = useState(location)

  const initialRegion = {
    latitude : region.latitude,
    longitude : region.longitude,
    latitudeDelta : 0.0460,
    longitudeDelta : 0.0260,
  }

  const coordinate = {
    latitude : region.latitude,
    longitude : region.longitude,
  }

  const stopPropagation = thunk => e => {
    e.stopPropagation();
    thunk();
  };

  function setTreasure() {
    navigation.navigate('Set', {Data: data, Location: coordinate})
  }
  
  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      {Platform.OS === 'ios'?
      <View style={styles.mapcontainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onPress={(e)=> { stopPropagation( setRegion(e.nativeEvent.coordinate) ) }}
        >
          <Marker
            coordinate={coordinate}
            onPress={setTreasure}
          />
        </MapView>
      </View>:
      <View style={styles.androidmapcontainer}>
        <MapView
          style={styles.android}
          initialRegion={initialRegion}
          provider={PROVIDER_GOOGLE}
          onPress={(e)=> { stopPropagation( setRegion(e.nativeEvent.coordinate) ) }}
        >
          <Marker
            coordinate={coordinate}
            onPress={setTreasure}
          />
        </MapView>
      </View>
      }
    </View>
  )
}