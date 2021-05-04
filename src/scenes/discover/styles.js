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
  get: {
    backgroundColor: '#ff8c00',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: 'center',
  },
  block: {
    backgroundColor: '#800080',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: 'center',
  },
  report: {
    backgroundColor: '#778899',
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