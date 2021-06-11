import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { firebase } from '../../../firebase'
import { colors } from 'theme'
import { NavigationContainer } from '@react-navigation/native'
import * as Notifications from 'expo-notifications'
import { LoginNavigator } from './stacks'
import TabNavigator from './tabs'
// import DrawerNavigator from './drawer'
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const navigationProps = {
  headerTintColor: 'white',
  headerStyle: { backgroundColor: colors.darkPurple },
  headerTitleStyle: { fontSize: 18 },
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .onSnapshot(function(document) {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
      } else {
        setLoading(false)
      }
    });
  }, []);

  (async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    await firebase.firestore().collection("tokens").doc(user.email).set({ token: token.data, email: user.email })
  })();

  if (loading) {
    return (
      <></>
    )
  }

  return(
    <NavigationContainer>
      { user ? (
        <TabNavigator user={user} navigationProps={navigationProps}/>
        ) : (
        <LoginNavigator navigationProps={navigationProps}/>
      )}
    </NavigationContainer>
  )
}