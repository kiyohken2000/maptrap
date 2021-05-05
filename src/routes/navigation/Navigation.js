import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { firebase } from '../../../firebase'
import { colors } from 'theme'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import * as Location from 'expo-location'
import Login from '../../scenes/login'
import Registration from '../../scenes/registration'
import Home from '../../scenes/home'
import Treasure from '../../scenes/treasure'
import Local from '../../scenes/location'
import Profile from '../../scenes/profile'
import Map from '../../scenes/map'
import Set from '../../scenes/set'
import Items from '../../scenes/items'
import Item from '../../scenes/item'
import Discover from '../../scenes/discover'
import * as Notifications from 'expo-notifications'
import * as Permissions from "expo-permissions"
// import DrawerNavigator from './drawer'
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const navigationProps = {
  headerTintColor: 'white',
  headerStyle: { backgroundColor: colors.darkPurple },
  headerTitleStyle: { fontSize: 18 },
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

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

  (async () => {
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
  })();

  if (loading) {
    return (
      <></>
    )
  }

  const HomeNavigator = () => {
    return (
      <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
        <Stack.Screen name="Home">
          {props => <Home {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Treasure">
          {props => <Treasure {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Location">
          {props => <Local {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Discover">
          {props => <Discover {...props} extraData={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  const LoginNavigator = () => {
    return (
      <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
      </Stack.Navigator>
    )
  }

  const ProfileNavigator = () => {
    return (
      <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
        <Stack.Screen name="Profile">
          {props => <Profile {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Map">
          {props => <Map {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Set">
          {props => <Set {...props} extraData={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  const ItemsNavigator = () => {
    return (
      <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
        <Stack.Screen name="Items">
          {props => <Items {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Item">
          {props => <Item {...props} extraData={user} />}
        </Stack.Screen>
        <Stack.Screen name="Location">
          {props => <Local {...props} extraData={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case 'Home':
              return (
                <FontIcon
                  name="home"
                  color={focused ? colors.lightPurple : colors.gray}
                  size={20}
                  solid
                />
              )
            case 'Items':
              return (
                <FontIcon
                  name="gift"
                  color={focused ? colors.lightPurple : colors.gray}
                  size={20}
                  solid
                />
              )
            case 'Profile':
              return (
                <FontIcon
                  name="user"
                  color={focused ? colors.lightPurple : colors.gray}
                  size={20}
                  solid
                />
              )
            default:
              return <View />
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.lightPurple,
        inactiveTintColor: colors.gray,
      }}
      initialRouteName="Home"
      swipeEnabled={false}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Items" component={ItemsNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  )

  return(
    <NavigationContainer>
      { user ? (
        <TabNavigator/>
        ) : (
        <LoginNavigator/>
      )}
    </NavigationContainer>
  )
}