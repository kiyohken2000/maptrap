import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { colors } from 'theme'
import Login from '../../../scenes/login'
import Registration from '../../../scenes/registration'
import Home from '../../../scenes/home'
import Overlooking from '../../../scenes/overlooking'
import Treasure from '../../../scenes/treasure'
import Local from '../../../scenes/location'
import Profile from '../../../scenes/profile'
import Map from '../../../scenes/map'
import Set from '../../../scenes/set'
import Items from '../../../scenes/items'
import Item from '../../../scenes/item'
import Scan from '../../../scenes/scan'
import Discover from '../../../scenes/discover'
import HeaderLeft from './HeaderLeft'
import HeaderTitle from './HeaderTitle'

// ------------------------------------
// Constants
// ------------------------------------

const Stack = createStackNavigator()

// ------------------------------------
// Navigators
// ------------------------------------

export const LoginNavigator = (props) => {
  const navigationProps = props.navigationProps
  return (
    <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="Registration"
        component={Registration}
      />
    </Stack.Navigator>
  )
}

export const HomeNavigator = (props) => {
  const user = props.user
  const navigationProps = props.navigationProps
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
      <Stack.Screen name="Overlooking">
        {props => <Overlooking {...props} extraData={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export const ProfileNavigator = (props) => {
  const user = props.user
  const navigationProps = props.navigationProps
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

export const ItemsNavigator = (props) => {
  const user = props.user
  const navigationProps = props.navigationProps
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
      <Stack.Screen name="Overlooking">
        {props => <Overlooking {...props} extraData={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export const DiscoverNavigator = (props) => {
  const user = props.user
  const navigationProps = props.navigationProps
  return (
    <Stack.Navigator headerMode="screen" screenOptions={navigationProps}>
      <Stack.Screen name="Scan">
        {props => <Scan {...props} extraData={user} />}
      </Stack.Screen>
      <Stack.Screen name="Discover">
        {props => <Discover {...props} extraData={user} />}
      </Stack.Screen>
      <Stack.Screen name="Location">
        {props => <Local {...props} extraData={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}