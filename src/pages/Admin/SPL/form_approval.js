import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {TopHeader, InputForm} from '../../../component';
import {colorLogo} from '../../../utils';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import {ActionButtonHalf} from '../ActionButton';
import Icon from 'react-native-vector-icons/Ionicons';
import SPLAPIService from '../../../services/SPL/APIservice';
import DateTimePicker from '@react-native-community/datetimepicker';

const FormApprovalSPL = ({route, navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const AreaReducer = useSelector(state => state.AreaReducer);
  const [loading, setLoading] = useState(false);
  const [header, setHeader] = useState([]);
  const [detail, setDetail] = useState([]);
  const [remark, setRemark] = useState('');
  const [showFromProjection, setShowFromProjection] = useState(false);
  const [dateFromProjection, setDateFromProjection] = useState('');
  const [showToProjection, setShowToProjection] = useState(false);
  const [dateToProjection, setDateToProjection] = useState('');

  const onChangeDateFromProjection = (event, selectedDate) => {
    const currentDate = selectedDate || dateFromProjection;
    console.log(currentDate);
    setShowFromProjection(Platform.OS == 'ios');
    setDateFromProjection(currentDate);
  };
  const onChangeDateToProjection = (event, selectedDate) => {
    const currentDate = selectedDate || dateToProjection;
    setShowToProjection(Platform.OS == 'ios');
    setDateToProjection(currentDate);
  };
  const getData = async () => {
    try {
      setLoading(true);
      const data = {
        spl_cd: route.params.spl_cd,
      };
      const res = await SPLAPIService.processGetDetailSPL(data);
      console.log(res.data.header);
      setHeader(res.data.header);
      setDateFromProjection(res.data.header.op_from);
      setDateToProjection(res.data.header.op_to);
      setDetail(res.data.detail);
      setLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item, index}) => {
    console.log;
    return (
      <View style={{marginBottom: 10, flexDirection: 'row'}}>
        <Icon active name="chevron-forward-sharp" size={14} />
        <Text>
          {item.tenant_ticket_id + ' : ' + item.tenant_ticket_description}
        </Text>
      </View>
    );
  };

  const handleConfirmation = async () => {
    Alert.alert(
      'Confirmation!',
      'Are you sure want to approve this result SPL?',
      [
        {
          text: 'No',
          onPress: () => console.log('cancel'),
          style: 'cancel',
        },
        {text: 'Yes, Sure!', onPress: () => handleProcessSPL()},
      ],
    );
  };

  const handleProcessSPL = async () => {
    try {
      setLoading(true);
      const data = {
        users: LoginReducer.form.profile,
        spl_cd: route.params.spl_cd,
        type: 'approve',
        remark: remark,
        dateFromProjection: moment(dateFromProjection).format('HH:mm'),
        dateToProjection: moment(dateToProjection).format('HH:mm'),
      };
      const res = await SPLAPIService.submitConfirmationSPL(data);

      if (res.data.code == 200) {
        setLoading(false);
        navigation.navigate('AdminSPL');
      } else {
        setLoading(false);
        console.log('error : ' + res.data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper.page}>
      <Spinner
        visible={loading}
        textContent={'Loading Process...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title="SPL"
        subTitle={
          '#' + route.params.spl_cd + '\n Status : ' + header.status_descs
        }
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.replace('AdminDashboard')}
      />
      <View style={styles.wrapper.subPage}>
        <ScrollView>
          <View style={styles.wrapper.content}>
            <InputForm
              placeholder="Date"
              value={moment(header.request_date)
                .format('dddd, DD MMMM YYYY')
                .toString()}
              editable={false}
            />
            <InputForm
              placeholder="Technician"
              value={header.username}
              editable={false}
            />
            <InputForm
              placeholder="Location"
              value={header.location}
              editable={false}
            />
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginRight: 5}}>
                <View style={{marginBottom: 15}}>
                  <Text style={styles.text2}>Work Schedule</Text>
                  <View style={styles.space(5)} />
                  <TextInput
                    editable={false}
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: colorLogo.color3,
                      borderRadius: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      fontSize: 14,
                      color: colorLogo.color3,
                    }}
                    placeholderTextColor={colorLogo.color3}
                    value={moment(header.ws_from).format('HH:mm')}
                  />
                </View>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Text>s/d</Text>
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <View style={{marginBottom: 15}}>
                  <Text style={styles.text2} />
                  <View style={styles.space(5)} />
                  <TextInput
                    editable={false}
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: colorLogo.color3,
                      borderRadius: 10,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      fontSize: 14,
                      color: colorLogo.color3,
                    }}
                    placeholderTextColor={colorLogo.color3}
                    value={moment(header.ws_to).format('HH:mm')}
                  />
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginRight: 5}}>
                <View style={{marginBottom: 15}}>
                  <Text style={styles.text2}>Overtime Projection *</Text>
                  <View style={styles.space(5)} />
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                      placeholder={dateFromProjection.toString()}
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
                        dateFromProjection == ''
                          ? dateFromProjection
                          : moment(dateFromProjection).format('HH:mm')
                      }
                      editable={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowFromProjection(true)}
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
                  {showFromProjection && (
                    <DateTimePicker
                      testID="startTimePicker"
                      value={moment(dateFromProjection).toDate()}
                      mode="time"
                      is24Hour={true}
                      display="spinner"
                      onChange={onChangeDateFromProjection}
                    />
                  )}
                </View>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Text>s/d</Text>
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <View style={{marginBottom: 15}}>
                  <Text style={styles.text2} />
                  <View style={styles.space(5)} />
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                      placeholder={dateToProjection.toString()}
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
                        dateToProjection == ''
                          ? dateToProjection
                          : moment(dateToProjection).format('HH:mm')
                      }
                      editable={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowToProjection(true)}
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
                  {showToProjection && (
                    <DateTimePicker
                      testID="startTimePicker"
                      value={moment(dateToProjection).toDate()}
                      mode="time"
                      is24Hour={true}
                      display="spinner"
                      onChange={onChangeDateToProjection}
                    />
                  )}
                </View>
              </View>
            </View>

            <InputForm
              placeholder="Note"
              value={header.note}
              editable={false}
            />
            {header.request_status == 'close' && (
              <InputForm
                placeholder="Result"
                value={header.result_note}
                editable={false}
              />
            )}
            {header.type == '1' && (
              <View>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 2,
                    marginBottom: 10,
                  }}
                />
                <View>
                  <Text style={{fontWeight: 'bold'}}>Ticket Reference</Text>
                </View>
                <View style={styles.space(10)} />
                <FlatList
                  data={detail}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 2,
                    marginTop: 10,
                  }}
                />
              </View>
            )}
            {header.replacing == '1' && (
              <View>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 2,
                    marginBottom: 10,
                  }}
                />
                <View>
                  <Text style={{fontWeight: 'bold'}}>
                    Replace shifting technician :
                  </Text>
                  <View style={styles.space(10)} />
                  <Text>
                    <Icon active name="chevron-forward-sharp" size={14} />{' '}
                    {header.userReplace}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 2,
                    marginTop: 10,
                  }}
                />
              </View>
            )}
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              paddingHorizontal: 20,
              paddingTop: 20,
            }}>
            <ActionButtonHalf
              style={{
                backgroundColor: colorLogo.color4,
                borderRadius: 25,
                paddingVertical: 13,
              }}
              title="Approve"
              onPress={() => handleConfirmation()}
            />
          </View>

          <View style={styles.space(20)} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: colorLogo.color4,
    },
    content: {
      borderRadius: 20,
      marginHorizontal: 15,
    },
    subPage: {
      paddingVertical: 10,
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: 'white',
    },
  },
  modal: {
    backgroundColor: 'white',
    margin: 0,
    alignItems: undefined,
    justifyContent: undefined,
  },
  text2: {
    fontSize: 12,
    // letterSpacing: 2,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: colorLogo.color3,
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default FormApprovalSPL;
