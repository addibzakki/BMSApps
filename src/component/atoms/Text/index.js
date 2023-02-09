import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import {RFPercentage} from 'react-native-responsive-fontsize';

export const TwoColumn = ({
  title,
  value,
  widthColumnFirst,
  widthColumnSecond,
  sideIcon,
}) => {
  return (
    <View style={styles.container}>
      <View style={{width: widthColumnFirst}}>
        <Text style={styles.textFirstColumn}>
          <Icon
            type="FontAwesome"
            active
            name={sideIcon}
            size={RFPercentage(2)}
          />{' '}
          {title}
        </Text>
      </View>
      <View style={{width: widthColumnSecond}}>
        <Text style={styles.textSecondColumn}>: {value}</Text>
      </View>
    </View>
  );
};

export const TextLineIndent = ({label, value}) => {
  return (
    <View
      style={{
        marginHorizontal: 15,
        flexDirection: 'row',
        marginBottom: 5,
      }}>
      <View style={{width: wp('25%')}}>
        <Text
          style={{
            fontSize: 16,
          }}>
          <Icon type="FontAwesome" active name="chevron-right" size={14} />{' '}
          {label}
        </Text>
      </View>
      <View style={{width: wp('2%'), paddingRight: 2}}>
        <Text
          style={{
            fontSize: 16,
            flex: 1,
            flexWrap: 'wrap',
            fontWeight: 'bold',
            textAlign: 'justify',
            lineHeight: 25,
          }}>
          :{' '}
        </Text>
      </View>
      <View style={{width: wp('67%')}}>
        <Text
          style={{
            fontSize: 16,
            flex: 1,
            // flexWrap: 'wrap',
            fontWeight: 'bold',
            // textAlign: 'justify',
            lineHeight: 25,
            paddingRight: 15,
          }}>
          {value}
        </Text>
      </View>
    </View>
  );
};

export const TextLineIndentLight = ({label, value}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          textAlign: 'justify',
          width: '20%',
          flexWrap: 'wrap-reverse',
        }}>
        {label}
      </Text>
      <Text
        style={{
          textAlign: 'justify',
          width: '1%',
          flexWrap: 'wrap-reverse',
        }}>
        :
      </Text>
      <Text style={{marginLeft: 3, textAlign: 'justify', width: '75%'}}>
        {value}
      </Text>
    </View>
  );
};

export const TextLineIndentOption = ({label, value}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          textAlign: 'justify',
          width: '20%',
          flexWrap: 'wrap-reverse',
        }}>
        {label}
      </Text>
      <Text
        style={{
          textAlign: 'justify',
          width: '1%',
          flexWrap: 'wrap-reverse',
        }}>
        :
      </Text>
      <View style={{marginLeft: 3, textAlign: 'justify', width: '75%'}}>
        <DropDownPicker style={{height: 40}} />
      </View>
      {/* <Text style={{marginLeft: 3, textAlign: 'justify', width: '75%'}}>
        {value}
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  textFirstColumn: {
    fontSize: RFPercentage(2),
  },
  textSecondColumn: {
    fontSize: RFPercentage(2),
    flex: 1,
    flexWrap: 'wrap',
    fontWeight: 'bold',
    textAlign: 'justify',
  },
  space: value => {
    return {
      height: value,
    };
  },
});
