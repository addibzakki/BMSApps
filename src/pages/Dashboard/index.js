import React, {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  BackHandler,
  Linking,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {
  collection,
  InputForm,
  inputTables,
  ListMenu,
  ListTicket,
  sendNotificationOneSignal,
} from '../../component';
import {colorLogo} from '../../utils';
import {userAvatar} from '../../assets';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import GlobalContext from '../../component/GlobalContext';
import {ActionButton, ActionButtonHalf} from './ActionButton';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  setForm,
  clearArea,
  setArea,
  setProfileId,
  setRefresh,
} from '../../redux';
import OneSignal from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import {
  DashboardAPIService,
  MeterAPIService,
  WorkAreaAPIService,
} from '../../services';
import AuthenticationAPIService from '../../services/Authentication/AuthenticationService';
import {RFPercentage} from 'react-native-responsive-fontsize';
import SPLAPIService from '../../services/SPL/APIservice';
import PettyLAPIService from '../../services/Petty/PettyAPIService';

const AdminDashboard = ({navigation}) => {
  const dispatch = useDispatch();
  const networkContext = useContext(GlobalContext);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const AreaReducer = useSelector(state => state.AreaReducer);
  const ProfileIdReducer = useSelector(state => state.ProfileIdReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [titelModal, setTitleModal] = useState('Loading');
  const [listSubmitTicket, setListSubmitTicket] = useState([]);
  const [notifHelpdesk, setNotifHelpdesk] = useState(false);
  const [valNotifHelpdesk, setValNotifHelpdesk] = useState(0);
  const [notifOvertime, setNotifOvertime] = useState(false);
  const [valNotifOvertime, setValNotifOvertime] = useState(0);
  const [notifSpl, setNotifSpl] = useState(false);
  const [valNotifSpl, setValNotifSpl] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalSPL, setShowModalSPL] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resultOvertime, setResultOvertime] = useState('');
  const [point, setPoint] = useState(0);
  const [dataSPL, setDataSPL] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (GlobalReducer.refresh == true) {
      getDataDashboard();
      getPoint();
      checkPetty();
    }

    const unsubscribe = navigation.addListener('focus', () => {
      getDataDashboard();
      getPoint();
      dumpData();
      collection(LoginReducer);
      checkPetty();
    });

    return () => {
      unsubscribe;
    };
  }, [networkContext.networkInfo, GlobalReducer.refresh == true]);

  const menu = [
    {
      rowID: 1,
      title: 'Assignment',
      icon: 'md-hand-left-outline',
      route: 'AdminAssignment',
      notification_val: valNotifHelpdesk,
      notification: notifHelpdesk,
    },
    {
      rowID: 2,
      title: 'Meter',
      icon: 'md-speedometer-outline',
      route: 'AdminMeter',
      notification_val: 0,
      notification: 'FALSE',
    },
    {
      rowID: 3,
      title: 'Overtime',
      icon: 'md-calendar-outline',
      route: 'Comming',
      notification_val: 0,
      notification: 'FALSE',
    },
    {
      rowID: 4,
      title: 'SPL',
      icon: 'md-reader-outline',
      route: 'AdminSPL',
      notification_val: valNotifSpl,
      notification: notifSpl,
    }
  ];
  const menuPetty = [
    {
      rowID: 1,
      title: 'Cash Advance',
      icon: 'cash-outline',
      route: 'PettyDashboard',
      notification_val: 1,
      notification: 'TRUE',
    },
    {
      rowID: 2,
      title: 'Cash Advance Pending',
      icon: 'cash',
      route: 'PettyDashboard',
      notification_val: 0,
      notification: 'TRUE',
    },
    {
      rowID: 3,
      title: 'History Cash Advance',
      icon: 'newspaper-outline',
      route: 'Comming',
      notification_val: 0,
      notification: 'FALSE',
    }
  ];

  const getDataDashboard = async () => {
    const today = new Date();
    const curHr = today.getHours();
    if (curHr < 12) {
      setGreeting('Good Morning');
    } else if (curHr < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
    setLoading(true);
    const deviceState = await OneSignal.getDeviceState();
    dispatch(setProfileId(deviceState.userId));
    try {
      let data = {
        users: LoginReducer.form.profile,
        player_id: deviceState.userId,
        devices: [
          DeviceInfo.getVersion(),
          DeviceInfo.getBrand(),
          DeviceInfo.getModel(),
        ],
        status: 1,
      };

      console.log(data);

      const res = await DashboardAPIService.getDashboard(data);
      console.log(res.data);
      if (res.data.show_message == true) {
        Alert.alert('Alert', res.data.message, [
          {
            text: 'Update',
            onPress: () => Linking.openURL(res.data.link),
            style: 'default',
          },
        ]);
      } else {
        if (res.data.password_check == 'notset') {
          setShowModal(true);
        } else {
          changeModal(false, 'Checking..');
          // ? check work area
          if (res.data.status == 'available') {
            dispatch(setArea(res.data.area[0], true));
            setLoading(false);
          } else {
            dispatch(clearArea());
            setLoading(false);
          }
          // notification and list ticket
          if (res.data.get.total_corrective > 0) {
            setNotifHelpdesk(true);
            setValNotifHelpdesk(res.data.get.total_corrective);
          }
          if (res.data.get.total_overtime > 0) {
            setNotifOvertime(true);
            setValNotifOvertime(res.data.get.total_overtime);
          }
          if (res.data.get.total_spl > 0) {
            setNotifSpl(true);
            setValNotifSpl(res.data.get.total_spl);
          }
          setListSubmitTicket([...res.data.get.list]);
        }
        dispatch(setRefresh(false));
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error.message);
      setLoading(false);
      setRefresh(false);
    }
  };

  const changeModal = (set, title) => {
    setLoadingModal(set);
    setTitleModal(title);
  };

  const checkSPL = async () => {
    if (LoginReducer.form.profile.level == 'Supervisor') {
      checkout_work_area();
    } else {
      changeModal(true, 'Checking SPL..');
      try {
        const params = {
          users: LoginReducer.form.profile,
        };
        const res = await SPLAPIService.getOutstandingSPL(params);
        if (res.data.count > 0) {
          setShowModalSPL(true);
          setDataSPL(res.data.data);
          changeModal(false, 'Complete..');
        } else {
          changeModal(false, 'Complete..');
          checkout_work_area();
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', error.message);
      }
    }
  };

  const checkPetty = async () => {
      try {
        const res = await PettyLAPIService.getBalance(LoginReducer.form.profile.uid);
        console.log(res.data.data);
        setBalance(res.data.data.balance_format);
      } catch (error) {
        console.log(error);
        Alert.alert('Error', error.message);
      }
  };

  const onCheckOut = async () => {
    Alert.alert('Attention', 'Are you sure want to check-out', [
      {
        text: 'No',
        onPress: () => console.log('check-out'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => checkSPL()},
    ]);
  };

  const checkout_work_area = async () => {
    setLoading(true);
    try {
      const data = {
        username: LoginReducer.form.profile.uid,
        player_id: ProfileIdReducer.profile_id,
      };
      const res = await WorkAreaAPIService.checkoutArea(data);
      sendNotificationOneSignal(
        'Presence User :',
        LoginReducer.form.profile.name +
          ' check-out from ' +
          AreaReducer.area['project_desc'],
        res.data.player_ids,
      );
      dispatch(clearArea());
      console.log(res.data.code, 'checkout work area succesfully');
      setLoading(false);
      navigation.replace('AdminDashboard');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  const changePassword = async () => {
    if (newPassword.trim() == '') {
      Alert.alert('Required', 'New password has required');
    } else {
      try {
        changeModal(true, 'Set New Password..');
        const data = {
          newPassword: newPassword,
          username: LoginReducer.form.profile.uid,
        };
        const res = await AuthenticationAPIService.changePassword(data);
        if (res.data.res == 'success') {
          changeModal(false, 'Set New Password..');
          setShowModal(false);
          dispatch(setForm(response.data.profile));
        } else {
          changeModal(false, 'Set New Password..');
          Alert.alert('error', 'Something wrong');
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', error.message);
      }
    }
  };

  const submitResult = async () => {
    if (resultOvertime == '') {
      Alert.alert('Required', 'Result field has required');
    } else {
      changeModal(true, 'Submit result overtime..');
      try {
        const params = {
          username: LoginReducer.form.profile.uid,
          spl_cd: dataSPL.spl_cd,
          result: resultOvertime,
        };
        const res = await SPLAPIService.submitResultSPL(params);
        if (res.data.code == 200) {
          changeModal(false, 'Checking..');
          checkout_work_area();
          setResultOvertime('');
          setShowModalSPL(false);
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', error.message);
      }
    }
  };

  const dumpData = async () => {
    try {
      const resp = await MeterAPIService.fetchListMeterOffline();
      resp.data.list.map(value => {
        inputTables(db, value, 'list_meter');
      });
      if (typeof resp.data.list_bms !== 'undefined') {
        resp.data.list_bms.map(val => {
          inputTables(db, val, 'bms_meter');
        });
      }
      db.transaction(txn => {
        txn.executeSql(
          'SELECT * FROM list_meter',
          [],
          (txn, res) => {
            console.log('Total data di list_meter:' + res.rows.length);
          },
          error => {
            console.log('error on select table list_meter ' + error.message);
          },
        );

        txn.executeSql(
          'SELECT * FROM bms_meter',
          [],
          (txn, res) => {
            console.log('Total data di bms_meter:' + res.rows.length);
          },
          error => {
            console.log('error on select table bms_meter ' + error.message);
          },
        );
      });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  const handleGoTo = screen => {
    navigation.navigate(screen);
  };

  const getPoint = async () => {
    try {
      const res = await DashboardAPIService.getPoint(
        LoginReducer.form.profile.uid,
      );
      setPoint(res.data.point);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  if (
    !(
      LoginReducer.form.profile.profile_photo == '' ||
      LoginReducer.form.profile.profile_photo == null
    )
  ) {
    imageSource = {
      uri: LoginReducer.form.profile.profile_photo,
    };
  } else {
    imageSource = userAvatar;
  }

  return (
    <View style={styles.wrapper.page}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colorLogo.color4}
      />
      <Spinner
        visible={loadingModal}
        textContent={titelModal}
        textStyle={{color: '#FFF'}}
      />
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={showModalSPL}
        onRequestClose={() => BackHandler.exitApp()}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            backgroundColor: colorLogo.color2,
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <KeyboardAvoidingView enabled>
            <View
              style={{
                paddingHorizontal: 20,
                alignItems: 'center',
              }}>
              <Icon active name="clipboard-outline" size={90} color="black" />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 24,
                  color: 'black',
                }}>
                Please give result for your overtime before check out!
              </Text>
            </View>
            <View style={styles.space(20)} />
            <View
              style={{
                paddingHorizontal: 20,
              }}>
              <InputForm
                style={{
                  borderWidth: 1,
                  borderColor: colorLogo.color3,
                  borderRadius: 10,
                  padding: 10,
                  fontSize: 14,
                  color: colorLogo.color3,
                  backgroundColor: 'white',
                  textAlignVertical: 'top',
                  height: 200,
                }}
                multiline={true}
                value={resultOvertime}
                onChangeText={value => setResultOvertime(value)}
              />
            </View>
            <View style={styles.space(20)} />
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                justifyContent: 'space-between',
              }}>
              <ActionButtonHalf
                title="Cancel"
                onPress={() => {
                  setShowModalSPL(false);
                  setResultOvertime('');
                }}
                style={{
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: colorLogo.color1,
                }}
              />
              <ActionButtonHalf
                title="Submit"
                onPress={() => submitResult()}
                style={{
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: colorLogo.color3,
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </Modal>

      <Modal
        animationType={'slide'}
        transparent={false}
        visible={showModal}
        onRequestClose={() => BackHandler.exitApp()}>
        <View
          style={{
            backgroundColor: colorLogo.color2,
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              alignItems: 'center',
            }}>
            <Icon active name="key-sharp" size={90} color="black" />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 24,
                color: 'black',
              }}>
              Please change your password immediately for your access security !
            </Text>
          </View>
          <View style={styles.space(40)} />
          <View
            style={{
              paddingHorizontal: 20,
            }}>
            <InputForm
              placeholder="New Password"
              secureTextEntry={true}
              autoCapitalize="none"
              value={newPassword}
              onChangeText={value => setNewPassword(value)}
            />
          </View>
          <View style={styles.space(20)} />
          <ActionButton title="Change" onPress={() => changePassword()} />
        </View>
      </Modal>
      <View style={styles.wrapper.top_container}>
        <View style={styles.space(10)} />
        <View style={styles.wrapper.greeting}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 16}}>{greeting},</Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
              {LoginReducer.form.profile.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
              {LoginReducer.form.profile.level
                ? LoginReducer.form.profile.level
                : 'Engineer'}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              paddingRight: 5,
            }}>
            <View
              style={{
                borderStyle: 'solid',
                borderWidth: 2,
                borderColor: colorLogo.color5,
                borderRadius: 50,
                width: 75,
                height: 75,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: RFPercentage(3), fontWeight: 'bold'}}>
                {point}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.space(10)} />
      </View>
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
        {AreaReducer.available ? (
          <View
            style={{
              marginBottom: 10,
              borderWidth: 1,
              borderRadius: 20,
              marginHorizontal: 10,
              backgroundColor: colorLogo.color4,
              paddingVertical: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}>
              <Text style={{color: 'white'}}>
                Available In : {AreaReducer.area['project_desc']}
              </Text>
              <TouchableOpacity
                onPress={() => onCheckOut()}
                style={{
                  borderColor: 'white',
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 10,
                }}>
                <Text style={{color: 'white'}}>Chek-Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              marginBottom: 10,
              borderWidth: 1,
              borderRadius: 20,
              marginHorizontal: 10,
              backgroundColor: colorLogo.color4,
              paddingVertical: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}>
              <Text style={{color: 'white'}}>Scan QR Code for attendance</Text>
              <TouchableOpacity onPress={() => navigation.navigate('WorkArea')}>
                <MaterialCommunityIcons
                  name="barcode-scan"
                  color="white"
                  size={28}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View
          style={{
            borderWidth: 1,
            borderRadius: 20,
            marginHorizontal: 10,
            backgroundColor: colorLogo.color4,
            paddingTop: 10,
            justifyContent: 'center',
          }}>
          <ListMenu list={menu} navigation={navigation} />
          <ListMenu list={menuPetty} navigation={navigation} />
        </View>
        
        <View style={styles.wrapper.menu}>
          <View style={styles.space(10)} />
          <View>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              <Icon name="arrow-redo-outline" size={20} /> Ticket
            </Text>
            <Text style={{fontSize: 14}}>Assignment Ticket For You :</Text>
          </View>
          <View style={styles.space(10)} />

          <ListTicket list={listSubmitTicket} navigation={navigation} />
        </View>
        <View style={styles.space(15)} />
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
    top_container: {
      paddingTop: 10,
      height: 130,
      backgroundColor: colorLogo.color4,
    },
    greeting: {
      height: 85,
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      paddingLeft: 20,
      alignItems: 'center',
      width: '97%',
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
    },
    menu: {
      flex: 1,
      borderRadius: 20,
      marginHorizontal: 10,
    },
    status: {
      flex: 1,
      borderRadius: 20,
      marginHorizontal: 20,
    },
  },
  utils: {
    text: {
      fontSize: 16,
    },
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default AdminDashboard;
