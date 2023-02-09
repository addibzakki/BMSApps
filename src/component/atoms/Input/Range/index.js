import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colorLogo, colorsInput} from '../../../../utils';
import Icon from 'react-native-vector-icons/Ionicons';

export const InputUntil = ({title, second_title = '', onHandle}) => {
  const [showFrom, setShowFrom] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [showTo, setShowTo] = useState(false);
  const [dateTo, setDateTo] = useState('');

  const onChangeDateFrom = (event, selectedDate) => {
    const currentDate = selectedDate || dateFrom;
    setShowFrom(Platform.OS === 'ios');
    setDateFrom(currentDate);
  };
  const onChangeDateTo = (event, selectedDate) => {
    const currentDate = selectedDate || dateTo;
    setShowTo(Platform.OS === 'ios');
    setDateTo(currentDate);
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{flex: 1, marginRight: 5}}>
        <View style={{marginBottom: 15}}>
          <Text style={styles.text2}>{title}</Text>
          <View style={styles.space(5)} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder={dateFrom.toString()}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colorLogo.color3,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
                fontSize: 14,
                color: colorLogo.color3,
              }}
              placeholderTextColor={colorLogo.color3}
              value={
                dateFrom == '' ? dateFrom : moment(dateFrom).format('HH:mm')
              }
            />
            <TouchableOpacity
              onPress={() => setShowFrom(true)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: colorLogo.color3,
                color: colorLogo.color3,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}>
              <Icon name="md-time-outline" size={20} />
            </TouchableOpacity>
          </View>
          {showFrom && (
            <DateTimePicker
              testID="startTimePicker"
              value={moment().toDate()}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={onChangeDateFrom}
            />
          )}
        </View>
      </View>
      <View style={{justifyContent: 'center'}}>
        <Text>s/d</Text>
      </View>
      <View style={{flex: 1, marginLeft: 5}}>
        <View style={{marginBottom: 15}}>
          <Text style={styles.text2}>{second_title}</Text>
          <View style={styles.space(5)} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder={dateTo.toString()}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colorLogo.color3,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
                fontSize: 14,
                color: colorLogo.color3,
              }}
              placeholderTextColor={colorLogo.color3}
              value={dateTo == '' ? dateTo : moment(dateTo).format('HH:mm')}
            />
            <TouchableOpacity
              onPress={() => setShowTo(true)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: colorLogo.color3,
                color: colorLogo.color3,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}>
              <Icon name="md-time-outline" size={20} />
            </TouchableOpacity>
          </View>
          {showTo && (
            <DateTimePicker
              testID="startTimePicker"
              value={moment().toDate()}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={onChangeDateTo}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colorsInput.default,
    borderRadius: 25,
    paddingVertical: 5,
    width: wp('90%'),
    textAlign: 'center',
    fontSize: 14,
    color: colorsInput.default,
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: colorsInput.default,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    paddingVertical: 5,
    width: wp('80%'),
    textAlign: 'center',
    fontSize: 14,
    color: colorsInput.default,
  },
  inputForm: {
    borderWidth: 1,
    borderColor: colorsInput.default,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    color: colorsInput.default,
  },
  inputForm2: {
    borderWidth: 1,
    borderColor: colorLogo.color3,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    color: colorLogo.color3,
    backgroundColor: 'white',
  },
  inputFormIcon: {
    flex: 1,
    borderWidth: 1,
    borderColor: colorLogo.color3,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    color: colorLogo.color3,
  },
  text: {
    letterSpacing: 2,
    fontWeight: 'bold',
    color: colorsInput.default,
  },
  text2: {
    fontSize: 12,
    // letterSpacing: 2,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: colorLogo.color3,
  },
  preview: {
    width: '85%',
    height: 114,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  space: value => {
    return {
      height: value,
    };
  },
});
