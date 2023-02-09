import React, {useContext, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Modal,
  Alert,
  BackHandler,
  Linking,
  RefreshControl,
  FlatList,
} from 'react-native';
import {
  InputForm,
  inputTables,
  ListMenu,
  sendNotificationOneSignal,
  SkeletonFakeList,
  TextLineIndentLight,
} from '../../component';
import {colorLogo} from '../../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import GlobalContext from '../../component/GlobalContext';
import {ActionButton} from './ActionButton';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  setForm,
  clearArea,
  setArea,
  setProfileId,
  setParamsRouteCorrective,
} from '../../redux';
import OneSignal from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import APIService from '../../services/APIService';
import {Body, Left, ListItem} from 'native-base';
import {global_style, dashboard_style} from '../../styles';
import {RFPercentage} from 'react-native-responsive-fontsize';
import moment from 'moment';
import {useStateIfMounted} from 'use-state-if-mounted';
import DashboardAPIService from '../../services/Dashboard/DashboardService';

function ModalChangePassword(props) {
  return (
    <Modal
      animationType={'slide'}
      transparent={false}
      visible={props.variable.showModal}
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
        {/* <View style={styles.space(40)} /> */}
        <View
          style={{
            paddingHorizontal: 20,
          }}>
          <InputForm
            placeholder="New Password"
            secureTextEntry={true}
            autoCapitalize="none"
            value={props.variable.newPassword}
            onChangeText={value => setNewPassword(value)}
          />
        </View>
        {/* <View style={styles.space(20)} /> */}
        <ActionButton title="Change" onPress={() => props.changePassword()} />
      </View>
    </Modal>
  );
}

function PanelCheckIn(props) {
  return (
    <View style={dashboard_style.container_content_attendance}>
      <View style={dashboard_style.content_attendance}>
        <Text style={dashboard_style.text_attendance}>
          Scan QR Code for attendance
        </Text>
        <TouchableOpacity onPress={() => props.navigate('WorkArea')}>
          <MaterialCommunityIcons name="barcode-scan" color="white" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PanelCheckOut(props) {
  return (
    <View style={dashboard_style.container_content_attendance}>
      <View style={dashboard_style.content_attendance}>
        <Text style={dashboard_style.text_attendance}>
          Available In : {props.area}
        </Text>
        <TouchableOpacity
          onPress={props.onPress}
          style={dashboard_style.button_check_out}>
          <Text style={dashboard_style.text_check_out}>Check-Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const AdminDashboard = ({navigation}) => {
  const dispatch = useDispatch();
  const networkContext = useContext(GlobalContext);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const AreaReducer = useSelector(state => state.AreaReducer);
  const ProfileIdReducer = useSelector(state => state.ProfileIdReducer);
  const [variable, setVariable] = useStateIfMounted({
    loading: true,
    loadingModal: false,
    listSubmitTicket: [],
    showModal: false,
    newPassword: '',
    refresh: false,
    point: 0,
  });
  const [menu, setMenu] = useStateIfMounted([]);
  const changeHandler = (value, inputType) => {
    setVariable({...variable, [inputType]: value});
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProfile();
      getMenu();
      getVersion();
      // getTicketAssignment();
    });

    return () => {
      unsubscribe;
    };
  }, [networkContext.networkInfo]);

  // TODO : get profile user & point user
  const getProfile = () => {};

  const getMenu = async () => {
    const deviceState = await OneSignal.getDeviceState();
    try {
      const data = {
        users: LoginReducer.form.profile,
        player_id: deviceState.userId,
        devices: [
          DeviceInfo.getVersion(),
          DeviceInfo.getBrand(),
          DeviceInfo.getModel(),
        ],
        status: 1,
      };
      const res = await DashboardAPIService.fetchListMenu(data);
      setMenu(res.data.data.menu);
    } catch (error) {
      console.log(error);
      Alert.alert('Error on fetch menu', error.message);
    }

    function errorOldVersion(res) {
      Alert.alert('Alert', res.data.message, [
        {
          text: 'Update',
          onPress: () => Linking.openURL(res.data.link),
          style: 'default',
        },
      ]);
    }
  };

  const getVersion = async () => {
    try {
      const res = DashboardAPIService.getVersion(DeviceInfo.getVersion());
      console.log(res.data);
    } catch (error) {
      console.log(error);
      Alert.alert('Error on get version : ', error.message);
    }
  };

  const getWorkArea = async () => {};

  const getContent = async () => {};

  const getDataDashboard = async () => {
    console.log('data dashboard');
    changeHandler(true, 'loading');

    dispatch(setProfileId(deviceState.userId));
    try {
      let params = {
        users: LoginReducer.form.profile,
        player_id: deviceState.userId,
        devices: [
          DeviceInfo.getVersion(),
          DeviceInfo.getBrand(),
          DeviceInfo.getModel(),
        ],
        status: 1,
      };
      const res = await APIService.getDashboard(params);
      if (res.data.show_message == true) {
        Alert.alert('Alert', res.data.message, [
          {
            text: 'Update',
            onPress: () => Linking.openURL(res.data.link),
            style: 'default',
          },
        ]);
      } else {
        setMenu(res.data.menu);
        if (res.data.password_check == 'notset') {
          changeHandler(true, 'showModal');
        } else {
          changeModal(false, 'Checking..');
          // check work area
          if (res.data.status == 'available') {
            dispatch(setArea(res.data.area[0], true));
            changeHandler(false, 'loading');
            changeHandler(false, 'refresh');
          } else {
            dispatch(clearArea());
            changeHandler(false, 'loading');
            changeHandler(false, 'refresh');
          }
          changeHandler([...res.data.get.list], 'listSubmitTicket');
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error.message);
      changeHandler(false, 'loading');
      changeHandler(false, 'refresh');
    }
  };

  const changeModal = (set, title) => {
    changeHandler(set, 'loadingModal');
    changeHandler(title, 'titleModal');
  };

  const onCheckOut = () => {
    Alert.alert('Attention', 'Are you sure want to check-out', [
      {
        text: 'No',
        onPress: () => console.log('check-out'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => checkout_work_area()},
    ]);
  };

  const checkout_work_area = async () => {
    try {
      changeHandler(true, 'loading');
      const params = {
        username: LoginReducer.form.profile.uid,
        player_id: ProfileIdReducer.profile_id,
      };
      const res = await APIService.checkoutArea(params);
      sendNotificationOneSignal(
        LoginReducer.form.profile.name +
          ' check-out from ' +
          AreaReducer.area['project_desc'],
        res.data.player_ids,
      );
      dispatch(clearArea());
      console.log(res.data.code, 'checkout work area succesfully');
      changeHandler(false, 'loading');
      navigation.replace('AdminDashboard');
    } catch (error) {
      Alert.alert(
        'Error',
        'Connection to API server failed with message : ' + error.message,
      );
    }
  };

  const changePassword = () => {
    if (newPassword.trim() === '') {
      Alert.alert('Required', 'New password has required');
    } else {
      changeModal(true, 'Set New Password..');
      axios
        .post('https://mynet.mmproperty.com/api/change_password_dev', {
          newPassword: newPassword,
          username: LoginReducer.form.profile.uid,
        })
        .then(function(response) {
          if (response.data.res == 'success') {
            changeModal(false, 'Set New Password..');
            setShowModal(false);
            dispatch(setForm(response.data.profile));
          } else {
            changeModal(false, 'Set New Password..');
            Alert.alert('error', 'Something wrong');
          }
        });
    }
  };

  const dumpData = () => {
    axios
      .get('https://mynet.mmproperty.com/api/list_meter_offline')
      .then(function(response) {
        response.data.list.map(value => {
          inputTables(db, value, 'list_meter');
        });
        if (typeof response.data.list_bms !== 'undefined') {
          response.data.list_bms.map(val => {
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
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const handleGoTo = item => {
    dispatch(setParamsRouteCorrective(item));
    navigation.navigate('AdminHelpdeskShow');
  };

  const renderItem = ({item, index}) => {
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar
        onPress={() => handleGoTo(item)}>
        <Left
          style={{
            backgroundColor: item.status_color,
            height: '100%',
            alignItems: 'center',
            paddingTop: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
          <View>
            <Ionicons
              active
              name="bookmarks-outline"
              style={{
                fontSize: RFPercentage(2.5),
                paddingHorizontal: 5,
                fontWeight: 'bold',
              }}
              color="white"
            />
          </View>
        </Left>
        <Body>
          <Text style={{fontWeight: 'bold', fontSize: RFPercentage(2)}}>
            {'#' + item.tenant_ticket_id}
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: RFPercentage(2)}}>
            {moment(item.tenant_ticket_post).format('DD/MMM/YYYY hh:mm A')}
          </Text>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: item.status_color,
            }}
          />
          <TextLineIndentLight label="Form" value={item.form_desc} />
          {item.type_desc !== null && (
            <TextLineIndentLight label="Type" value={item.type_desc} />
          )}
          {item.category_desc !== null && (
            <TextLineIndentLight label="Category" value={item.category_desc} />
          )}
          <TextLineIndentLight
            label="Location"
            value={item.tenant_ticket_location}
          />
        </Body>
      </ListItem>
    );
  };

  const onRefresh = () => {
    console.log('refresh');
    changeHandler(true, 'refresh');
    getDataDashboard();
  };

  setTimeout(() => {
    changeHandler(false, 'loading');
  }, 2000);

  const renderEmpty = () => {
    if (variable.loading === true) {
      return <SkeletonFakeList row={4} height={110} />;
    } else {
      return (
        <View style={global_style.container_empty}>
          <Text style={global_style.text_empty}>NO LISTING TICKET</Text>
        </View>
      );
    }
  };

  return (
    <View style={dashboard_style.page}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colorLogo.color4}
      />
      <Spinner
        visible={variable.loadingModal}
        textContent={variable.titelModal}
        textStyle={dashboard_style.text_spinner}
      />
      <ModalChangePassword
        variable={variable}
        changePassword={changePassword}
      />
      <View style={dashboard_style.top_container}>
        <View style={dashboard_style.greeting}>
          <View>
            <Text style={dashboard_style.text_name}>
              {LoginReducer.form.profile.name}
            </Text>
            <Text style={dashboard_style.text_level}>
              {LoginReducer.form.profile.level}
            </Text>
          </View>
          <View style={dashboard_style.container_point}>
            <View style={dashboard_style.content_point}>
              <Text style={dashboard_style.text_point}>{variable.point}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={dashboard_style.container_attendance}>
        {AreaReducer.available ? (
          <PanelCheckOut
            navigate={navigation.navigate}
            onPress={() => onCheckOut()}
            area={AreaReducer.area['project_desc']}
          />
        ) : (
          <PanelCheckIn navigate={navigation.navigate} />
        )}
        <View style={dashboard_style.container_menu}>
          <ListMenu list={menu} navigation={navigation} />
        </View>
        <View style={dashboard_style.menu}>
          <View>
            <Text style={{fontSize: RFPercentage(2.5), fontWeight: 'bold'}}>
              <Icon name="arrow-redo-outline" size={RFPercentage(2.5)} /> Ticket
            </Text>
            <Text style={{fontSize: RFPercentage(2)}}>
              Assignment Ticket For You :
            </Text>
          </View>

          <FlatList
            removeClippedSubviews={false}
            data={variable.listSubmitTicket}
            disableVirtualization={false}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={variable.refresh}
                onRefresh={onRefresh}
              />
            }
          />
        </View>
      </View>
    </View>
  );
};

export default AdminDashboard;
