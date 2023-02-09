import React, {useEffect, useState} from 'react';
import {View, StatusBar, Dimensions, ScrollView} from 'react-native';
import {Text} from 'native-base';
import {TopHeader, Select, InputDateRangeFilter} from '../../../component';
import axios from 'axios';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ActionButton} from '../ActionButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colorLogo} from '../../../utils';

const AdminOvertimeReport = ({navigation}) => {
  const [listCompany, setListCompany] = useState([]);
  const [company, setCompany] = useState('');
  const [listOvertimeStatus, setListOvertimeStatus] = useState([]);
  const [overtimeStatus, setOvertimeStatus] = useState('');
  const [startTime, setStartTime] = useState(moment().toDate());
  const [endTime, setEndTime] = useState(moment().toDate());
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const handleSetCompany = itemValue => {
    setCompany(itemValue);
  };

  const handleSetOvertimeStatus = itemValue => {
    setOvertimeStatus(itemValue);
  };

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setShowStart(Platform.OS === 'ios');
    setStartTime(currentDate);
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setShowEnd(Platform.OS === 'ios');
    if (selectedDate < startTime) {
      alert("Start time can't less than overtime");
      setEndTime(startTime);
    } else {
      setEndTime(currentDate);
    }
  };

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      getData();
    }
    return () => {
      unmounted = true;
    };
  }, []);

  const getData = () => {
    const url = 'https://mynet.mmproperty.com/api/get_list_master';
    axios
      .get(url)
      .then(function(response) {
        setListCompany([...response.data.optCompany]);
        setListOvertimeStatus([...response.data.optStatus]);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const HandleNext = () => {
    navigation.replace('AdminOvertimeResult', {
      company: company,
      status: overtimeStatus,
      startTime: startTime,
      endTime: endTime,
    });
  };

  return (
    <View style={styles.wrapper.page}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colorLogo.color2}
      />
      <TopHeader
        title="Overtime"
        subTitle="Report"
        onPress={() => navigation.goBack()}
      />
      <View style={styles.space(10)} />
      <View style={styles.wrapper.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{borderRadius: 20, marginHorizontal: 15}}>
            <Select
              list={listCompany}
              placeholder="tenant"
              selectedValue={company}
              onValueChange={handleSetCompany}
            />
          </View>
          <View style={styles.space(15)} />
          <View style={{borderRadius: 20, marginHorizontal: 15}}>
            <Select
              list={listOvertimeStatus}
              placeholder="status"
              selectedValue={overtimeStatus}
              onValueChange={handleSetOvertimeStatus}
            />
          </View>
          <View style={styles.space(15)} />
          <View style={{borderRadius: 20, marginHorizontal: 15}}>
            <Text style={styles.text}>Periode</Text>
            <View style={styles.space(5)} />
            <View
              style={{
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <InputDateRangeFilter
                  placeholder="DD-MM-YYYY"
                  value={
                    startTime ? moment(startTime).format('DD-MM-YYYY') : ''
                  }
                  editable={false}
                  onPress={() => setShowStart(true)}
                />
                {showStart && (
                  <DateTimePicker
                    testID="startTimePicker"
                    value={startTime}
                    mode="calendar"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeStart}
                  />
                )}
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  marginHorizontal: 5,
                }}>
                <Ionicons name="arrow-forward-sharp" size={20} />
              </View>
              <View style={{flex: 1}}>
                <InputDateRangeFilter
                  placeholder="DD-MM-YYYY"
                  value={endTime ? moment(endTime).format('DD-MM-YYYY') : ''}
                  editable={false}
                  onPress={() => setShowEnd(true)}
                />
                {showEnd && (
                  <DateTimePicker
                    testID="endTimePicker"
                    value={endTime}
                    mode="calendar"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeEnd}
                  />
                )}
              </View>
            </View>
          </View>
          <View style={styles.space(20)} />
          <ActionButton title="Next" onPress={() => HandleNext()} />
          <View style={styles.space(10)} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: 'white',
    },
  },
  utils: {
    text: {
      fontSize: 16,
    },
  },
  text: {
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: colorLogo.color3,
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default AdminOvertimeReport;
