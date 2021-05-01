import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Modal, TouchableOpacity } from 'react-native'
import styles from './styles'
import MapView, { Marker } from 'react-native-maps'
import { Divider, Avatar } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Input } from 'galio-framework'
import { firebase } from '../../../firebase'

export default function Map({ route, navigation }) {
  const data = route.params.Data
  const location = route.params.Location.coords
  const [region, setRegion] = useState(location)
  const [modal, setToggle] = useState(false)
  const [treasureName, setTreasureName] = useState('')
  const [comment, setComment] = useState('')

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

  function closeModal() {
    setToggle(false)
  }

  function opneModal() {
    setToggle(true)
  }

  function setTreasure() {
    const treasureRef = firebase.firestore().collection('treasures').doc()
    treasureRef.set({
      id: treasureRef.id,
      treasureName: treasureName,
      comment: comment,
      latitude: region.latitude,
      longitude: region.longitude,
      createdTime: new Date().getTime(),
      createrEmail: data.email,
      createrId: data.id,
      treasureImage: 'https://firebasestorage.googleapis.com/v0/b/maptrap.appspot.com/o/logo.jpg?alt=media&token=4ebae158-5b7d-4ca9-b244-21c597c8f5b4'
    })
    const userRef1 = firebase.firestore().collection('users').doc(data.id)
    userRef1.update({
      treasure: firebase.firestore.FieldValue.arrayUnion(treasureRef.id)
    })
    const userRef2 = firebase.firestore().collection('users2').doc(data.email)
    userRef2.update({
      treasure: firebase.firestore.FieldValue.arrayUnion(treasureRef.id)
    })
    setTreasureName('')
    setComment('')
    setToggle(false)
  }
  
  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <View style={styles.mapcontainer}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onPress={(e)=> { stopPropagation( setRegion(e.nativeEvent.coordinate) ) }}
        >
          <Marker
            coordinate={coordinate}
            onPress={opneModal}
          />
        </MapView>
      </View>
      <Modal
        visible={modal}
        transparent={false}
        animationType={"slide" || "fade"}
        presentationStyle={"fullScreen" || "pageSheet" || "formSheet" || "overFullScreen"}
      >
        <View style={styles.modalcontainer}>
          <View style={{ flex: 1, width: '100%' }}>
            <View style={styles.modaltitle}>
              <Text style={styles.modalText}>Create Treasure</Text>
            </View>
            <Divider />
              <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                <View style={styles.container}>
                  <View style={styles.avatar}>
                    <Avatar
                      size="xlarge"
                      rounded
                      title="NI"
                      source={{ uri: data.avatar }}
                    />
                  </View>
                  <View style={styles.regionContainer}>
                    <Text style={styles.description}>Coordinate</Text>
                    <Text style={styles.coordinate}>{region.latitude}</Text>
                    <Text style={styles.coordinate}>{region.longitude}</Text>
                  </View>
                  <Text>Treasure Name</Text>
                  <Input
                    name='name'
                    placeholder="your name"
                    rounded
                    onChangeText={(text) => setTreasureName(text)}
                    value={treasureName}
                  />
                  <Text>Comments</Text>
                  <Input
                    name='comment'
                    style={{height:150}}
                    placeholder="your comment"
                    rounded
                    multiline
                    onChangeText={(text) => setComment(text)}
                    value={comment}
                  />
                  <View style={styles.buttonContainer}>
                    {comment?<TouchableOpacity style={styles.tbutton} onPress={setTreasure}>
                      <Text style={styles.buttonText}>Set</Text>
                    </TouchableOpacity>:
                    <View style={styles.nonbutton}>
                      <Text style={styles.buttonText}>Set</Text>
                    </View>}
                  </View>
                </View>
              </KeyboardAwareScrollView>
            <Divider />
            <View style={styles.footerContainer}>
              <TouchableOpacity style={styles.Pbutton} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}