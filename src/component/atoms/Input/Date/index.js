import React, {useState} from 'react';
import {TextInput, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colorLogo} from '../../../../utils';

export const InputDate = ({placeholder, onPress}) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(moment().toDate());

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          placeholder={date.toString()}
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
          value={date}
        />
        <TouchableOpacity
          onPress={() => setShow(true)}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colorLogo.color3,
            color: colorLogo.color3,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Icon name="calendar-outline" size={20} />
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          testID="startTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )}
    </View>
  );
};
