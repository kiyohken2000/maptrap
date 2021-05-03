import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import * as Notifications from 'expo-notifications'
import React, { useState, useEffect } from 'react'

export default function geofence() {

useEffect(() => {
  (async () => {
    isLocationPermissionGiven
    onPressStartGeofencing
    let location = await Location.getCurrentPositionAsync({})
    setLocation(location)
  })();
}, []);

const GEOFENCING_ON_ENTER = 'geofencingOnEnter'

const isLocationPermissionGiven = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return false;
  }
  let statusBackground = await Location.requestBackgroundPermissionsAsync();
  if (statusBackground.status !== "granted") {
    return false;
  }
  console.log(statusBackground)
  return true;
}

const regions = [
  {
    identifier: '晴海トリトンスクエア', // 柵のID
    latitude: 35.657413, // 緯度
    longitude: 139.782514, // 経度
    radius: 300 // 柵の半径
  },
  {
    identifier: 'koko',
    latitude: 37.956998462219346,
    longitude: 139.14524414682023,
    radius: 300
  }
]

const onPressStartGeofencing = () => {
  (async () => {
    isLocationPermissionGiven()
    let location = await Location.getCurrentPositionAsync({})
    setLocation(location)
    console.log(location)
    await Location.startGeofencingAsync(GEOFENCING_ON_ENTER, regions)
  })();
  console.log('start')
}

TaskManager.defineTask(GEOFENCING_ON_ENTER, ({ data: { eventType, region }, error }) => {
  if (error) {
    console.error(error.message);
    return;
  }
  // ジオフェンス内に入ったイベントであれば、プッシュ通知を表示
  if (eventType === Location.GeofencingEventType.Enter) {
    alert('in')
    Notifications.presentLocalNotificationAsync({
      title: 'test geofence notification',
      body: 'geofence notification',
      data: {
        message: 'geofence notification message',
      },
    });
  }
});

}