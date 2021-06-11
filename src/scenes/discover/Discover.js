import React, { useState, useEffect } from 'react'
import { Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { firebase } from '../../../firebase'
import Dialog from 'react-native-dialog'

export default function Discover({ route, navigation }) {
  const userData = route.params.myProfile
  const treasureID = route.params.treasureID
  const [treasure, setTreasure] = useState([])
  const [dialog, setDialog] = useState(false)

  useEffect(() => {
    let isMounted = true
    const treasureRef = firebase.firestore().collection('treasures').doc(treasureID)
    treasureRef.get().then((doc) => {
      if (doc.exists) {
        treasureRef
        .onSnapshot(function(document) {
          const data = document.data()
          setTreasure(data)
        })
      } else {
        null
      }
    })
    return () => { isMounted = false }
  },[])

  const getItem = () => {
    const userRef2 = firebase.firestore().collection('users2').doc(userData.email)
    const userRef = firebase.firestore().collection('users').doc(userData.id)
    userRef2.update({
      items: firebase.firestore.FieldValue.arrayUnion(treasure.id)
    })
    userRef.update({
      items: firebase.firestore.FieldValue.arrayUnion(treasure.id)
    })
    const treasureRef = firebase.firestore().collection('treasures').doc(treasure.id)
    treasureRef.update({
      picked: firebase.firestore.FieldValue.arrayUnion(userData.email)
    })
    setDialog(false)
    navigation.navigate('Scan')
  }

  const report = () => {
    const reportRef = firebase.firestore().collection('report').doc()
    reportRef.set({
      id: reportRef.id,
      treasureID: treasure.id,
      creater: treasure.createrEmail,
      name: treasure.treasureName,
      comment: treasure.comment,
      image: treasure.treasureImage
    })
    .then(() => {
      alert('Report has been sent.')
      navigation.navigate('Scan')
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  }

  const block = () => {
    const userRef2 = firebase.firestore().collection('users2').doc(userData.email)
    const userRef = firebase.firestore().collection('users').doc(userData.id)
    userRef2.update({
      block: firebase.firestore.FieldValue.arrayUnion(treasure.id)
    })
    userRef.update({
      block: firebase.firestore.FieldValue.arrayUnion(treasure.id)
    })
    alert('Added to the block list.')
    navigation.navigate('Scan')
  }

  function goMap() {
    navigation.navigate('Location', {Location: treasure})
  }

  return (
    <View style={styles.root}>
    <StatusBar barStyle="light-content" />
      <ScrollView style={{ flex: 1, width: '100%' }}>
        <View style={styles.imagecontainer}>
          <Image source={{uri: treasure.treasureImage}} style={styles.image}/>
        </View>
        <Text style={styles.field}>Name:</Text>
        <Text style={styles.title}>{treasure.treasureName}</Text>
        <Text style={styles.field}>Comment:</Text>
        <Text style={styles.title}>{treasure.comment}</Text>
        {treasure.extraComment?
          <>
            <Text style={styles.field}>Extra Comment:</Text>
            <Text style={styles.title}>{treasure.extraComment}</Text>
          </>:null
        }
        <TouchableOpacity style={styles.get} onPress={() => setDialog(true)}>
          <Text style={styles.buttonText}>Get this Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goMap}>
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.block} onPress={block}>
          <Text style={styles.buttonText}>Block</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.report} onPress={report}>
          <Text style={styles.buttonText}>Report</Text>
        </TouchableOpacity>
      </ScrollView>
      <Dialog.Container visible={dialog}>
        <Dialog.Title>When you get it, you will be published.</Dialog.Title>
        <Dialog.Button label="Get" bold={true} onPress={() => getItem()} />
        <Dialog.Button label="Cancel" onPress={() => setDialog(false)} />
      </Dialog.Container>
    </View>
  )
}