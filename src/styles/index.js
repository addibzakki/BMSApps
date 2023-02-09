import {Dimensions, StyleSheet} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {colorLogo, colors, colorsInput} from '../utils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const global_style = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colorLogo.color4,
  },

  sub_page: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },

  content: {
    paddingTop: 5,
    marginHorizontal: 10,
  },

  content_center: {
    flex: 1,
    flexWrap: 'wrap',
    alignContent: 'center',
    alignItems: 'center',
  },

  sub_menu_button_container: {
    backgroundColor: colorLogo.color4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 5,
    height: 90,
    flex: 1,
    paddingHorizontal: 10,
  },

  text_sub_menu: {
    color: 'white',
    fontSize: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  container_empty: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },

  text_empty: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  badge_square_container: {
    position: 'absolute',
    top: 5,
    right: 5,
  },

  font_badge: {
    fontSize: 12,
  },
  image_grid: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 5,
    height: 90,
    flex: 1,
    paddingHorizontal: 10,
  },

  modal_full_background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorLogo.color4,
  },

  modal_full_opacity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },

  modal_full_content: {
    flex: 1,
    width: '100%',
    marginTop: 86,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    // padding: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    fontSize: 20,
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

export const login_style = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.default,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  brand: {alignItems: 'center', marginBottom: 40},
  textBranding: {
    fontFamily: 'Orbitron-Black',
    letterSpacing: 10,
    fontSize: RFPercentage(10),
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: 'white',
  },
  textSubBranding: {
    // fontFamily: 'Orbitron-Black',
    fontSize: RFPercentage(3),
    textAlign: 'center',
    fontWeight: 'bold',
    color: colorLogo.color4,
  },
  sectionStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  textError: {
    fontSize: RFPercentage(2.5),
    textAlign: 'center',
    color: colors.error,
    marginBottom: 5,
  },
  fieldPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: colorsInput.default,
    borderRadius: 25,
    paddingVertical: 5,
    width: wp('90%'),
    textAlign: 'center',
    fontSize: 14,
    color: colorsInput.default,
  },
  sectionButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textVersion: {
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  image: {
    width: wp('100%'),
    resizeMode: 'contain',
  },
});
