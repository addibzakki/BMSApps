import {Dimensions, StyleSheet} from 'react-native';
import {colorLogo} from '../../../../../utils';

export const global_style = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colorLogo.color4,
  },
  space: value => {
    return {
      height: value,
    };
  },
});

export const cm_style = StyleSheet.create({
  subPage: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },
  sub_third_container: {
    marginHorizontal: 15,
  },
  text_third_container: {
    color: colorLogo.color3,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    borderWidth: 0.5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'flex-end',
  },
  image_size: {
    flex: 1,
    height: Dimensions.get('window').height / 4 - 12,
    width: Dimensions.get('window').width / 2 - 4,
    margin: 1,
  },
});

export const spl_style = StyleSheet.create({
  subPage: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },
});
