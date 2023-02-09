import React from 'react';
import {View, Text, StatusBar} from 'react-native';
import {ButtonBack} from '../../atoms';
import {colorLogo} from '../../../utils';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';

export const TopHeader = ({title, subTitle = null, onPress, onPressHome}) => {
  let showSubTitle = false;
  if (subTitle != null) {
    showSubTitle = true;
  }
  return (
    <View>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colorLogo.color4}
      />
      <View
        style={{
          backgroundColor: colorLogo.color4,
        }}>
        <View style={styles.space(10)} />
        <ButtonBack title={title} onPress={onPress} onPressHome={onPressHome} />
        {showSubTitle && (
          <View>
            <View style={styles.space(15)} />
            <View style={{borderRadius: 20, marginHorizontal: 10}}>
              <Text
                style={{
                  alignSelf: 'center',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  fontSize: 14,
                  letterSpacing: 2,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                {subTitle}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.space(15)} />
      </View>
    </View>
  );
};

export const TopHeaderNews = ({title, subTitle, onPress, date}) => {
  return (
    <View
      style={{
        backgroundColor: colorLogo.color2,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}>
      <View style={styles.space(10)} />
      <ButtonBack title={title} onPress={onPress} />
      <View style={styles.space(15)} />
      <View style={{borderRadius: 20, marginHorizontal: 10}}>
        <Text
          style={{
            textAlign: 'center',
            textTransform: 'uppercase',
            fontSize: 18,
            letterSpacing: 2,
            fontWeight: 'bold',
            color: 'white',
          }}>
          {subTitle}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 5,
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
          }}>
          <Icon type="FontAwesome5" name="clock" size={14} />{' '}
          {moment(date).format('DD-MM-YYYY HH:mm')}
        </Text>
      </View>
      <View style={styles.space(15)} />
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
