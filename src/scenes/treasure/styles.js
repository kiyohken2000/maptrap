import { StyleSheet, Dimensions } from 'react-native';
import { colors } from 'theme'

export default StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagecontainer: {
    marginTop: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems:'center',
  },
  image: {
    width: 300,
    height: 300,
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
  delbutton: {
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
})