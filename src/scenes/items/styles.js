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
  item: {
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
  },
  comment: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 10,
    opacity: 0.4,
    alignSelf: 'flex-start',
  },
  date: {
    fontSize: 15,
    marginLeft: 10,
    opacity: 0.4,
    alignSelf: 'flex-end',
  },
  imagecontainer: {
    marginTop: 10,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems:'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
})