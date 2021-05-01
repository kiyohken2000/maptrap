import { StyleSheet, Dimensions } from 'react-native';
import { colors } from 'theme'

export default StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  field: {
    fontSize: 15,
    textAlign: 'center'
  },
  avatar: {
    margin: 30,
    alignSelf: "center",
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20
  },
  footerLink: {
    color: "#788eec",
    fontWeight: "bold",
    fontSize: 16
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
  nonbutton: {
    backgroundColor: '#CCCCCC',
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