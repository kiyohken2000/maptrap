import React, { useState } from 'react'
import { Text, View, StatusBar, Image, TextInput, TouchableOpacity, Platform } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './styles'
import { firebase } from '../../../firebase'
import Spinner from 'react-native-loading-spinner-overlay'
import { ConfirmDialog } from 'react-native-simple-dialogs'

export default function Login({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [dialog, setDialog] = useState(true)

  const onFooterLinkPress = () => {
    navigation.navigate('Registration')
  }

  const onLoginPress = () => {
    setSpinner(true)
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid
        const usersRef = firebase.firestore().collection('users')
        usersRef
          .doc(uid)
          .get()
          .then(firestoreDocument => {
            if (!firestoreDocument.exists) {
              setSpinner(false)
              alert("User does not exist anymore.")
              return;
            }
          })
          .catch(error => {
            setSpinner(false)
            alert(error)
          });
      })
      .catch(error => {
        setSpinner(false)
        alert(error)
      })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {Platform.OS != 'ios'?
        <ConfirmDialog
          visible={dialog}
          title="Find Good Oneは位置情報を使用します"
          positiveButton={{
            title: 'OK',
            onPress: () => setDialog(false)
          }}
        >
          <View>
            <Text>このアプリは、アプリが閉じているか使用されていない場合でも、宝箱を探す機能、宝箱を設置する機能を有効にするために位置情報を収集します</Text>
          </View>
        </ConfirmDialog>:null
      }
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <Image
          style={styles.logo}
          source={require('../../../assets/images/logo-lg.png')}
        />
        <TextInput
          style={styles.input}
          placeholder='E-mail'
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder='Password'
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onLoginPress()}>
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
        </View>
      </KeyboardAwareScrollView>
      <Spinner
        visible={spinner}
        textStyle={{ color: "#fff" }}
        overlayColor="rgba(0,0,0,0.5)"
      />
    </View>
  )
}