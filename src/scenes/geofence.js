import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import * as Notifications from 'expo-notifications'
import React, { useState, useEffect } from 'react'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask("test", ({ data: { eventType, region }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  if (eventType === Location.LocationGeofencingEventType.Enter) {
    console.log("You've entered region:", region);
    /*alert(`in ${region.identifier}`)*/
    Notifications.scheduleNotificationAsync({
      content: {
        title: region.identifier,
        body: 'Entry my geofence',
        data: { message: 'geofence notification message', },
      },
      trigger: null //{ seconds: 1 }
    });
  }
});

export default function geofence() {
  const [treasuresArray, setTreasures] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)
  
  (async () => {
    const treasuresRef = firebase.firestore().collection('treasures')
    treasuresRef
    .onSnapshot(querySnapshot => {
      const treasures = querySnapshot.docs.map(documentSnapshot => {
        const data = documentSnapshot.data()
        return {
          identifier: data.identifier,
          latitude: data.latitude,
          longitude: data.longitude,
          radius: data.radius,
        };
      });
      setTreasures(treasures);
      console.log(treasuresArray)
    });
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let bg = await Location.requestBackgroundPermissionsAsync();
    if (bg.status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    await Location.startGeofencingAsync("test", 
      [{
        identifier: "test-1",
        latitude: 37.95699846221934,
        longitude: 139.14524414682023,
        radius: 200,
        comment: 'we',
      }],
    );
  })();
}