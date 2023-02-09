import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  TopHeader,
  Button,
  InputForm,
  TextLineIndent,
  InputDropdownForm,
  sendNotificationOneSignal,
} from '../../../component';
import {colorLogo} from '../../../utils';
import Spinner from 'react-native-loading-spinner-overlay';
import {Content, Body, ListItem, CheckBox, Right} from 'native-base';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import SPLAPIService from '../../../services/SPL/APIservice';

const RequestSPL = ({navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showButtonRef, setShowButtonRef] = useState(false);
  const [showButtonLong, setShowButtonLong] = useState(false);
  const [showFromSchedule, setShowFromSchedule] = useState(false);
  const [dateFromSchedule, setDateFromSchedule] = useState('');
  const [showToSchedule, setShowToSchedule] = useState(false);
  const [dateToSchedule, setDateToSchedule] = useState('');
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [valueLocation, setValueLocation] = useState(null);
  const [openLocation, setOpenLocation] = useState(false);
  const [valueReplacing, setValueReplacing] = useState(null);
  const [openReplacing, setOpenReplacing] = useState(false);
  const [listEngineer, setListEngineer] = useState([]);
  const [listAllEngineer, setListAllEngineer] = useState([]);
  const [listLocation, setListLocation] = useState([]);
  const [listTicket, setListTicket] = useState([]);
  const [noteSPL, setNoteSPL] = useState('');
  const [entityProject, setEntityProject] = useState('');
  const [projectNo, setProjectNo] = useState('');

  const onChangeDateFromSchedule = (event, selectedDate) => {
    const currentDate = selectedDate || dateFromSchedule;
    setShowFromSchedule(Platform.OS == 'ios');
    setDateFromSchedule(currentDate);
  };
  const onChangeDateToSchedule = (event, selectedDate) => {
    const currentDate = selectedDate || dateToSchedule;
    setShowToSchedule(Platform.OS == 'ios');
    setDateToSchedule(currentDate);
  };

  const [isCheckedType, setIsCheckedType] = useState(false);
  const [isCheckedLong, setIsCheckedLong] = useState(false);

  const [showFromProjection, setShowFromProjection] = useState(false);
  const [dateFromProjection, setDateFromProjection] = useState('');
  const [showToProjection, setShowToProjection] = useState(false);
  const [dateToProjection, setDateToProjection] = useState('');

  const onChangeDateFromProjection = (event, selectedDate) => {
    const currentDate = selectedDate || dateFromProjection;
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
      const res = await SPLAPIService.getSPV({
        spv: LoginReducer.form.profile.uid,
      });
      setListEngineer([...res.data.engineer]);
      const resp = await SPLAPIService.getLocation({
        spv: LoginReducer.form.profile.uid,
      });
      setListLocation([...resp.data.location]);

      const resu = await SPLAPIService.processGetTicketSPL({
        users: LoginReducer.form.profile.uid,
      });
      setListTicket(resu.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmRequest = () => {
    Alert.alert('Confirmation!', 'Are you sure want to submit this SPL?', [
      {
        text: 'No',
        onPress: () => console.log('cancel'),
        style: 'cancel',
      },
      {text: 'Yes, Sure!', onPress: () => handleRequestSPL()},
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, []);

  const validateField = () => {
    if (isCheckedType == true) {
      var count = 0;
      for (var i = 0; i < listTicket.length; i++) {
        if (listTicket[i].isChecked == 'true') {
          count++;
        }
      }
    }
    if (value == null) {
      Alert.alert('Error!', 'Field Technician is required');
    } else if (valueLocation == null) {
      Alert.alert('Error!', 'Field Location is required');
    } else if (dateFromSchedule == '' || dateToSchedule == '') {
      Alert.alert('Error!', 'Field Work Schedule is required');
    } else if (dateFromProjection == '' || dateToProjection == '') {
      Alert.alert('Error!', 'Field Overtime Projection is required');
    } else if (noteSPL == '') {
      Alert.alert('Error!', 'Field Note is required');
    } else if (count < 1) {
      Alert.alert(
        'Error!',
        'Please select your ticket for reasoning overtime!',
      );
    } else if (isCheckedLong == true && valueReplacing == null) {
      Alert.alert('Error!', 'Field Replacing is required');
    } else {
      handleConfirmRequest();
    }
  };

  const chkbox_check_type = () => {
    if (value == null) {
      Alert.alert('Error!', 'Please choose a technician first');
    } else {
      if (isCheckedType == true) {
        setIsCheckedType(false);
        setShowButtonRef(false);
      } else {
        setIsCheckedType(true);
        setShowButtonRef(true);
      }
    }
  };

  const chkbox_check_long = async () => {
    if (value == null) {
      Alert.alert('Error!', 'Please choose a technician first');
    } else {
      const rest = await SPLAPIService.getSPV({
        spv: LoginReducer.form.profile.uid,
        type: 'ALL',
      });
      setListAllEngineer([...rest.data.engineer]);
      resetReplacing();
      if (isCheckedLong == true) {
        setIsCheckedLong(false);
        setShowButtonLong(false);
      } else {
        setIsCheckedLong(true);
        setShowButtonLong(true);
      }
    }
  };

  const resetReplacing = () => {
    setValueReplacing(null);
  };

  const handleRequestSPL = async () => {
    try {
      setLoading(true);
      const data = {
        username: value,
        dateFromSchedule: moment(dateFromSchedule).format('HH:mm'),
        dateToSchedule: moment(dateToSchedule).format('HH:mm'),
        dateFromProjection: moment(dateFromProjection).format('HH:mm'),
        dateToProjection: moment(dateToProjection).format('HH:mm'),
        entity_project: entityProject,
        project_no: projectNo,
        type: isCheckedType ? '1' : '0',
        replacing: isCheckedLong ? '1' : '0',
        userReplace: valueReplacing,
        note: noteSPL,
        list: listTicket,
        createdBy: LoginReducer.form.profile.uid,
      };
      const res = await SPLAPIService.submitSPL(data);
      if (res.data.code == 200) {
        setLoading(false);
        sendNotificationOneSignal(
          'Overtime Order :',
          'You have a work order from the ' +
            LoginReducer.form.profile.name +
            ' on the date ' +
            moment().format('DD MM YYYY'),
          res.data.player_ids,
        );
        navigation.replace('AdminSPL');
      } else {
        setLoading(false);

        console.log('Error : ' + res.data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('error', error.message);
      setLoading(false);
    }
  };

  const chkbox_check = (item, ind) => {
    let tmp = listTicket;
    let res = '';
    if (tmp.includes(item)) {
      if (item.isChecked == 'true') {
        tmp.find(
          tmp => tmp.tenant_ticket_id == item.tenant_ticket_id,
        ).isChecked = 'false';
      } else {
        tmp.find(
          tmp => tmp.tenant_ticket_id == item.tenant_ticket_id,
        ).isChecked = 'true';
      }
    }
    setListTicket([...tmp]);
  };

  const handleSetLocation = async itemValue => {
    const index = listLocation.findIndex(val => val.id == itemValue);
    if (index >= 0) {
      const loc = itemValue.split('::');
      setEntityProject(loc[0]);
      setProjectNo(loc[1]);
    }
  };
  const renderEmpty = () => {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          NOTHING OUTSTANDING TICKET
        </Text>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <Content>
        <ListItem
          onPress={() => chkbox_check(item, index)}
          style={{paddingLeft: 0, marginLeft: 0}}>
          <CheckBox
            onPress={() => chkbox_check(item, index)}
            checked={listTicket[index].isChecked == 'true' ? true : false}
            style={{
              paddingLeft: 0,
              marginLeft: 0,
              marginTop: 0,
              paddingTop: 0,
              borderWidth: 1,
            }}
          />
          <Body>
            <TextLineIndent label="Ticket No" value={item.tenant_ticket_id} />
            <TextLineIndent
              label="Post Date"
              value={moment(item.tenant_ticket_post).format(
                'DD/MM/YYYY HH:mm:ss',
              )}
            />
            <TextLineIndent
              label="Description"
              value={item.tenant_ticket_description}
            />
          </Body>
        </ListItem>
      </Content>
    );
  };

  return (
    <View style={styles.wrapper.page}>
      <Spinner
        visible={loading}
        textContent={'Submit SPL...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title="SPL"
        subTitle={
          'Form Create Overtime \n' + moment().format('dddd, DD MMMM YYYY')
        }
        onPress={() => navigation.replace('AdminSPL')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />

      <View style={styles.wrapper.subPage}>
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={modalVisible}>
          <View
            style={{
              flex: 1,
              alignContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: colorLogo.color3,
                alignItems: 'center',
                paddingVertical: 25,
              }}>
              <Text style={{color: 'white'}}>List Ticket Outstanding</Text>
            </View>
            <FlatList
              data={listTicket}
              renderItem={renderItem}
              ListEmptyComponent={renderEmpty()}
              keyExtractor={(item, index) => index.toString()}
            />

            <View style={{paddingHorizontal: 20, marginBottom: 20}}>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
        <ScrollView>
          <View style={styles.wrapper.content}>
            <InputDropdownForm
              placeholder="Technician *"
              searchable={true}
              open={open}
              value={value}
              items={listEngineer}
              setOpen={setOpen}
              setValue={setValue}
              // onChangeValue={val => handleSetTechnician(val)}
              itemSeparator={true}
            />
            <InputDropdownForm
              placeholder="Location *"
              searchable={false}
              open={openLocation}
              value={valueLocation}
              items={listLocation}
              setOpen={setOpenLocation}
              setValue={setValueLocation}
              onChangeValue={val => handleSetLocation(val)}
              itemSeparator={true}
            />
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginRight: 5}}>
                <View style={{marginBottom: 15}}>
                  <Text style={styles.text2}>Work Schedule *</Text>
                  <View style={styles.space(5)} />
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                      placeholder={dateFromSchedule.toString()}
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
                        dateFromSchedule == ''
                          ? dateFromSchedule
                          : moment(dateFromSchedule).format('HH:mm')
                      }
                      editable={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowFromSchedule(true)}
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
                  {showFromSchedule && (
                    <DateTimePicker
                      testID="startTimePicker"
                      value={moment().toDate()}
                      mode="time"
                      is24Hour={true}
                      display="spinner"
                      onChange={onChangeDateFromSchedule}
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
                      placeholder={dateToSchedule.toString()}
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
                        dateToSchedule == ''
                          ? dateToSchedule
                          : moment(dateToSchedule).format('HH:mm')
                      }
                      editable={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowToSchedule(true)}
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
                  {showToSchedule && (
                    <DateTimePicker
                      testID="startTimePicker"
                      value={moment().toDate()}
                      mode="time"
                      is24Hour={true}
                      display="spinner"
                      onChange={onChangeDateToSchedule}
                    />
                  )}
                </View>
              </View>
            </View>

            {/* <InputUntil title="Overtime Projection" /> */}
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
                      value={moment().toDate()}
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
                      value={moment().toDate()}
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
              placeholder="Note *"
              multiline={true}
              value={noteSPL}
              onChangeText={val => setNoteSPL(val)}
            />
            {showButtonLong && (
              <InputDropdownForm
                placeholder={'Replacing *'}
                searchable={true}
                open={openReplacing}
                value={valueReplacing}
                items={listAllEngineer}
                setOpen={setOpenReplacing}
                setValue={setValueReplacing}
                itemSeparator={true}
              />
            )}

            <ListItem
              style={{
                paddingLeft: 0,
                marginLeft: 0,
                marginTop: 0,
              }}
              noBorder>
              <CheckBox
                onPress={() => chkbox_check_type()}
                checked={isCheckedType}
                style={{
                  paddingLeft: 0,
                  marginLeft: 0,
                  marginTop: 0,
                  paddingTop: 0,
                }}
              />
              <Body>
                <Text
                  style={{
                    marginLeft: 10,
                    letterSpacing: 2,
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    color: colorLogo.color3,
                  }}>
                  Based on ticket
                </Text>
              </Body>
              {showButtonRef && (
                <Right>
                  <TouchableOpacity
                    style={{
                      width: 120,
                      padding: 5,
                      borderRadius: 10,
                      backgroundColor: 'orange',
                    }}
                    onPress={() => setModalVisible(true)}>
                    {/* <Icon type="FontAwesome" name="share" size={14} /> */}
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: 'white',
                      }}>
                      Ticket Reference
                    </Text>
                  </TouchableOpacity>
                </Right>
              )}
            </ListItem>
            <ListItem
              style={{
                paddingLeft: 0,
                marginLeft: 0,
                marginTop: 0,
                paddingTop: 0,
              }}
              noBorder>
              <CheckBox
                onPress={() => chkbox_check_long()}
                checked={isCheckedLong}
                style={{
                  paddingLeft: 0,
                  marginLeft: 0,
                  marginTop: 0,
                  paddingTop: 0,
                }}
              />
              <Body>
                <Text
                  style={{
                    marginLeft: 10,
                    letterSpacing: 2,
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    color: colorLogo.color3,
                  }}>
                  Long Shift
                </Text>
              </Body>
            </ListItem>
          </View>
          <View style={styles.space(10)} />
          <View style={{paddingHorizontal: 20}}>
            <View style={styles.space(5)} />
            <Button title="Submit Request" onPress={() => validateField()} />
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

export default RequestSPL;
