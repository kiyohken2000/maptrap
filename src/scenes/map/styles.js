import { StyleSheet, Dimensions } from 'react-native';
import { colors } from 'theme'

export default StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  avatar: {
    margin: 5,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    textAlign: 'center'
  },
  coordinate: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  regionContainer: {
    marginBottom: 5,
  },
  buttonContainer: {
    width: '100%'
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  mapcontainer: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,
  },
  modaltitle: {
    paddingTop: 40,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalcontainer: {
    flex: 1,
  },
  footerContainer: {
    marginBottom: 70
  },
  Pbutton: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: 'center',
  },
  tbutton: {
    backgroundColor: '#ff7f50',
    marginTop: 20,
    height: 48,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: 'center',
  },
  nonbutton: {
    backgroundColor: '#CCCCCC',
    marginTop: 20,
    height: 48,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: 'center',
  },
})