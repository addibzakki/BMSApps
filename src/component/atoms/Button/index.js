import React from 'react';
import {View, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import {Badge, Button as ButtonBase} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {colorLogo} from '../../../utils';
import {useSelector} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

export const Button = ({title, onPress, ...rest}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#303f9f',
        borderRadius: 25,
        paddingVertical: 13,
        width: wp('90%'),
      }}
      onPress={onPress}
      {...rest}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: 'white',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const ButtonBack = ({title, onPress, onPressHome}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  return (
    <View
      style={{
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'white',
            paddingHorizontal: 5,
          }}
          onPress={onPress}>
          <Icon name="ios-chevron-back" size={25} color="white" />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, alignItems: 'flex-end'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{alignItems: 'flex-end', marginRight: 5}}>
            <Text
              style={{
                letterSpacing: 2,
                fontSize: 12,
                // fontWeight: 'bold',
                color: 'white',
                textTransform: 'uppercase',
              }}>
              {LoginReducer.form.profile.name}
            </Text>
            <Text
              style={{
                textAlign: 'left',
                letterSpacing: 2,
                fontSize: 12,
                fontWeight: 'bold',
                color: 'white',
              }}>
              {title}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderRadius: 5,
                borderColor: 'white',
                padding: 3,
              }}
              onPress={onPressHome}>
              <Icon name="home" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export const ButtonHalf = ({title, onPress, ...rest}) => {
  return (
    <TouchableOpacity onPress={onPress} {...rest}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: 'white',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const ButtonIconBadge = ({
  title,
  onPress,
  icon,
  notif = 'FALSE',
  value = 0,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        // backgroundColor: colorLogo.color4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        // width: wp('32%'),
        // paddingVertical: 10,
      }}>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 50,
          padding: 10,
        }}>
        <Icon
          name={icon}
          size={24}
          color={colorLogo.color4}
          style={{
            fontWeight: 'bold',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        {notif != 'FALSE' && (
          <Badge style={{position: 'absolute', top: 0, right: -10}}>
            <Text style={{color: '#FFFFFF', fontSize: RFPercentage(2)}}>
              {value}
            </Text>
          </Badge>
        )}
      </View>
      <Text
        style={{
          marginTop: 5,
          color: '#FFFFFF',
          fontSize: RFPercentage(1.5),
          // fontWeight: 'bold',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const ButtonIcon = ({title, onPress, icon}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        // backgroundColor: colorLogo.color4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        width: wp('29%'),
        paddingVertical: 10,
      }}>
      {/* <Image source={buttonHelpdesk} style={{width: 72, height: 72}} />
                <View style={styles.space(5)} /> */}
      <Icon
        name={icon}
        size={24}
        color={colorLogo.color4}
        style={{
          backgroundColor: 'white',
          borderRadius: 50,
          padding: 10,
          fontWeight: 'bold',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      <Text
        style={{
          marginTop: 5,
          color: 'white',
          fontSize: 14,
          // fontWeight: 'bold',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const ButtonAttachment = ({title, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        padding: 10,
        borderRadius: 10,
        borderColor: colorLogo.color3,
      }}
      onPress={onPress}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: colorLogo.color3,
          letterSpacing: 2,
        }}>
        <Icon name="add-circle-outline" size={12} />
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const ButtonAdd = ({onPress}) => {
  return (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
      }}>
      <TouchableHighlight
        onPress={onPress}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: 80 / 2,
          backgroundColor: colorLogo.color2,
        }}>
        <View>
          <Icon name="add" size={36} color="white" />
        </View>
      </TouchableHighlight>
    </View>
  );
};

export const ButtonAddCircular = ({onPress}) => {
  return (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
      }}>
      <TouchableHighlight
        onPress={onPress}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: 80 / 2,
          backgroundColor: colorLogo.color2,
        }}>
        <View>
          <Icon name="add" size={36} color="white" />
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = {
  space: value => {
    return {
      height: value,
    };
  },
};
