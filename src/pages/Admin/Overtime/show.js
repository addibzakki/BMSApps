import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {ActionButton} from '../ActionButton';
import {
  InputDateRangeFilter,
  InputForm,
  TopHeader,
  TwoColumn,
} from '../../../component';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colorLogo} from '../../../utils';
import {RFPercentage} from 'react-native-responsive-fontsize';

const ShowOvertime = ({navigation, route}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [dateEnd, setDateEnd] = useState('');
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(moment().toDate());

  const HandleRequestUpdate = () => {
    setLoading(true);
    const data = {
      overtime_code: route.params.overtimeCode,
      created_by: LoginReducer.form.profile.name,
    };
    axios
      .post('https://mynet.mmproperty.com/api/request_update', data)
      .then(function(response) {
        if (response.data.message == 'success') {
          setLoading(false);
          if (route.params.overtimeAction == 'approval') {
            navigation.replace('AdminOvertimeList', {
              status: route.params.status,
            });
          } else {
            navigation.replace('OvertimeDashboard');
          }
        } else {
          Alert.alert('error', 'Request failed');
          setLoading(false);
        }
      })
      .catch(function(response) {
        console.log(response);
        setLoading(false);
      });
  };

  const HandleRequestApprove = () => {
    setLoading(true);
    const data = {
      overtime_code: route.params.overtimeCode,
      overtime_status: route.params.overtimeStatusCode,
      approve_by: LoginReducer.form.profile.name,
    };

    axios
      .post('https://mynet.mmproperty.com/api/approve', data)
      .then(function(response) {
        if (response.data.message == 'success') {
          setLoading(false);
          navigation.replace('AdminOvertimeList', {
            status: route.params.status,
          });
        } else {
          Alert.alert('error', 'Request failed');
          setLoading(false);
        }
      })
      .catch(function(response) {
        console.log(response);
        setLoading(false);
      });
  };

  const HandleRequestApproveUpdate = () => {
    setLoading(true);
    const data = {
      overtime_status: route.params.overtimeStatusCode,
      overtime_code: route.params.overtimeCode,
      approve_by: LoginReducer.form.profile.name,
    };

    axios
      .post('https://mynet.mmproperty.com/api/approve_update', data)
      .then(function(response) {
        if (response.data.message == 'success') {
          setLoading(false);
          navigation.replace('AdminOvertimeList', {
            status: route.params.status,
          });
        } else {
          Alert.alert('error', 'Request failed');
          setLoading(false);
        }
      })
      .catch(function(response) {
        console.log(response);
        setLoading(false);
      });
  };

  const HandleClose = () => {
    setVisibleModal(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setDateEnd(currentDate);
  };

  let buttonSubmit;
  if (
    route.params.overtimeStatusCode == 1 &&
    route.params.overtimeAction == 'show'
  ) {
    buttonSubmit = (
      <ActionButton
        title="Request Update"
        onPress={() => HandleRequestUpdate()}
      />
    );
  } else if (
    route.params.overtimeStatusCode == 1 &&
    route.params.overtimeAction == 'approval'
  ) {
    buttonSubmit = (
      <ActionButton title="Approve" onPress={() => HandleRequestApprove()} />
    );
  } else if (
    route.params.overtimeStatusCode == 8 &&
    route.params.overtimeAction == 'approval'
  ) {
    buttonSubmit = (
      <ActionButton
        title="Approve to modify"
        onPress={() => HandleRequestApproveUpdate()}
      />
    );
  }

  const loadDate = () => {
    // setDateEnd(moment().toDate());
    setShow(true);
  };

  const handleSubmitRealisasi = () => {
    if (dateEnd == '') {
      Alert.alert('Attention', 'Date realization must be input');
    } else {
      Alert.alert(
        'Attention',
        'Are you sure want to close this overtime request',
        [
          {
            text: 'No',
            onPress: () => console.log('close canceled'),
            style: 'cancel',
          },
          {text: 'Yes', onPress: () => handleProcessClose()},
        ],
      );
    }
  };

  const handleProcessClose = () => {
    setLoading(true);
    const data = {
      overtime_code: route.params.overtimeCode,
      overtime_close_date: moment.utc(dateEnd),
      overtime_close_by: LoginReducer.form.profile.uid,
    };
    axios
      .post('https://mynet.mmproperty.com/api/close_overtime', data)
      .then(function(response) {
        if (response.data.message == 'success') {
          setLoading(false);
          setVisibleModal(false);
          navigation.replace('AdminOvertimeList', {
            status: 'all',
          });
        } else {
          Alert.alert('error', 'Request failed');
          setLoading(false);
        }
      })
      .catch(function(response) {
        console.log(response);
        setLoading(false);
      });
  };

  let buttonClose;
  const ignoreStatus = [1, 8, 9, 11, 10];
  if (ignoreStatus.includes(route.params.overtimeStatusCode) != true) {
    buttonClose = (
      <ActionButton title="Close Overtime" onPress={() => HandleClose()} />
    );
  }

  return (
    <View style={styles.wrapper.page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spinner
          visible={loading}
          textContent={'Submiting Overtime...'}
          textStyle={{color: '#FFF'}}
        />
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={visibleModal}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <View
              style={{
                paddingHorizontal: 20,
                alignItems: 'center',
              }}>
              <Icon
                active
                name="md-timer-outline"
                size={RFPercentage(15)}
                color="black"
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: RFPercentage(3),
                  color: 'black',
                }}>
                Please make sure your realization time for close this overtime
                request !
              </Text>
            </View>
            <View style={styles.space(40)} />
            <View
              style={{
                paddingHorizontal: 20,
              }}>
              <InputDateRangeFilter
                value={
                  dateEnd == ''
                    ? ''
                    : moment(dateEnd).format('DD-MM-YYYY H:mm:ss')
                }
                editable={false}
                onPress={() => loadDate()}
              />
              {show && (
                <DateTimePicker
                  testID="startTimePicker"
                  value={date}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onChangeDate}
                />
              )}
            </View>
            <View style={styles.space(20)} />
            <View style={{flexDirection: 'row'}}>
              <View style={{paddingHorizontal: 20}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colorLogo.color1,
                    borderRadius: 25,
                    paddingVertical: 13,
                    width: wp('40%'),
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    setDate(moment().toDate());
                    setDateEnd('');
                    setVisibleModal(false);
                  }}>
                  <Text
                    style={{
                      fontSize: RFPercentage(1.7),
                      fontWeight: 'bold',
                      color: 'white',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{paddingHorizontal: 20}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#303f9f',
                    borderRadius: 25,
                    paddingVertical: 13,
                    width: wp('40%'),
                  }}
                  onPress={() => handleSubmitRealisasi()}>
                  <Text
                    style={{
                      fontSize: RFPercentage(1.7),
                      fontWeight: 'bold',
                      color: 'white',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <TopHeader
          title="Overtime"
          subTitle={route.params.overtimeCode}
          onPress={() =>
            navigation.replace('AdminOvertimeList', {
              status: route.params.status,
            })
          }
          onPressHome={() => navigation.navigate('AdminDashboard')}
        />
        <View style={styles.space(10)} />
        <View style={styles.wrapper.content}>
          <View style={{borderWidth: 1, padding: 5}}>
            <Text
              style={{
                borderBottomWidth: 1,
                textAlign: 'center',
                marginBottom: 10,
                paddingVertical: 5,
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: 2,
                fontSize: RFPercentage(2.5),
              }}>
              Detail
            </Text>
            <TwoColumn
              title="Overtime Date"
              value={route.params.overtimeDateFormat}
              widthColumnFirst="30%"
              widthColumnSecond="70%"
              sideIcon="chevron-right"
            />
            <TwoColumn
              title="Tenant"
              value={route.params.tenant_name}
              widthColumnFirst="30%"
              widthColumnSecond="70%"
              sideIcon="chevron-right"
            />
            <TwoColumn
              title="Type"
              value={route.params.overtimeType}
              widthColumnFirst="30%"
              widthColumnSecond="70%"
              sideIcon="chevron-right"
            />
            <TwoColumn
              title="Zone"
              value={route.params.overtimeZone}
              widthColumnFirst="30%"
              widthColumnSecond="70%"
              sideIcon="chevron-right"
            />
            <TwoColumn
              title="Start Time"
              value={moment(route.params.overtimeStart).format('HH:mm')}
              widthColumnFirst="30%"
              widthColumnSecond="70%"
              sideIcon="chevron-right"
            />
            <TwoColumn
              title="End Time"
              value={moment(route.params.overtimeEnd).format('HH:mm')}
              widthColumnFirst="30%"
              widthColumnSecond="70%"
              sideIcon="chevron-right"
            />
            <TwoColumn
              title="Duration"
              value={moment(route.params.overtimeDuration).format('HH:mm')}
              widthColumnFirst="30%"
              widthColumnSecond="70%"
              sideIcon="chevron-right"
            />
            <TwoColumn
              title="Status"
              value={route.params.overtimeStatus}
              widthColumnFirst="30%"
              widthColumnSecond="70%"
              sideIcon="chevron-right"
            />
          </View>
          <View style={styles.space(10)} />
          <View style={{borderWidth: 1, padding: 5}}>
            <Text
              style={{
                borderBottomWidth: 1,
                textAlign: 'center',
                marginBottom: 10,
                paddingVertical: 5,
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: 2,
                fontSize: RFPercentage(2.5),
              }}>
              Internal User
            </Text>
            {route.params.overtimeUser.map((user, key) => {
              return (
                <TwoColumn
                  key={key}
                  title={'User ' + (key + 1)}
                  value={user}
                  widthColumnFirst="30%"
                  widthColumnSecond="70%"
                  sideIcon="chevron-right"
                />
              );
            })}
          </View>
        </View>
        <View style={styles.space(15)} />
        {buttonSubmit}
        <View style={styles.space(5)} />
        {buttonClose}
        <View style={styles.space(15)} />
      </ScrollView>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: 'white',
    },
    content: {
      borderRadius: 20,
      marginHorizontal: 15,
    },
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default ShowOvertime;
