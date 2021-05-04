import { StyleSheet, Dimensions } from 'react-native';
import { colors } from 'theme'

export default StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  imagecontainer: {
    marginTop: 10,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems:'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 40,
  },
  title: {
    fontSize: 24,
    textAlign: 'center'
  },
  field: {
    fontSize: 15,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: 'center',
  },
  dumpbutton: {
    backgroundColor: '#a0522d',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  avatar: {
    margin: 10,
    alignSelf: "center",
  },
  picked: {
    marginTop: 20,
    fontSize: 15,
    textAlign: 'center'
  },
})