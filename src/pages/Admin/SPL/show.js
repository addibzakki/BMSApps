import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Alert,
  FlatList,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {TopHeader, InputForm} from '../../../component';
import {colorLogo} from '../../../utils';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import {ActionButtonHalf} from '../ActionButton';
import Icon from 'react-native-vector-icons/Ionicons';
import SPLAPIService from '../../../services/SPL/APIservice';
import {global_style} from '../../../styles';

const ShowSPL = ({route, navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const AreaReducer = useSelector(state => state.AreaReducer);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [header, setHeader] = useState([]);
  const [detail, setDetail] = useState([]);
  const [remark, setRemark] = useState('');
  const [showModalSPL, setShowModalSPL] = useState(false);
  const [resultOvertime, setResultOvertime] = useState('');
  const [dataSPL, setDataSPL] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [titelModal, setTitleModal] = useState('Loading');
  const getData = async () => {
    try {
      setLoading(true);
      const data = {
        spl_cd: route.params.spl_cd,
      };
      const res = await SPLAPIService.processGetDetailSPL(data);
      console.log(res.data.header);
      setHeader(res.data.header);
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

  const changeModal = (set, title) => {
    setLoadingModal(set);
    setTitleModal(title);
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
          getData();
          changeModal(false, 'Checking..');
          setResultOvertime('');
          setShowModalSPL(false);
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleConfirmation = async type => {
    if (type == 'cancel') {
      Alert.alert(
        'Confirmation!',
        'Are you sure want to cancel this request SPL?',
        [
          {
            text: 'No',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {text: 'Yes, Sure!', onPress: () => handleProcessSPL(type)},
        ],
      );
    } else if (type == 'reject') {
      Alert.alert(
        'Confirmation!',
        'Are you sure want to reject this request SPL?',
        [
          {
            text: 'No',
            onPress: () => console.log('reject'),
            style: 'cancel',
          },
          {text: 'Yes, Sure!', onPress: () => handleProcessSPL(type)},
        ],
      );
    } else if (type == 'approve') {
      Alert.alert(
        'Confirmation!',
        'Are you sure want to approve this result SPL?',
        [
          {
            text: 'No',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {text: 'Yes, Sure!', onPress: () => handleProcessSPL(type)},
        ],
      );
    } else if (type == 'close') {
      // Alert.alert('Confirmation!', 'Are you sure want to close this SPL?', [
      //   {
      //     text: 'No',
      //     onPress: () => console.log('reject'),
      //     style: 'cancel',
      //   },
      //   {text: 'Yes, Sure!', onPress: () => handleProcessSPL(type)},
      // ]);

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
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert(
        'Confirmation!',
        'Are you sure want to confirm this request SPL?',
        [
          {
            text: 'No',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {text: 'Yes, Sure!', onPress: () => handleProcessSPL(type)},
        ],
      );
    }
  };

  const handleProcessSPL = async type => {
    try {
      setLoading(true);
      const data = {
        users: LoginReducer.form.profile,
        spl_cd: route.params.spl_cd,
        type: type,
        remark: remark,
      };
      const res = await SPLAPIService.submitConfirmationSPL(data);

      if (res.data.code == 200) {
        setLoading(false);
        setModalVisible(false);
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

  const checkStatus = statusResult => {
    var includeStatus = ['approve', 'close'];
    if (includeStatus.includes(statusResult)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <View style={styles.wrapper.page}>
      <Spinner
        visible={loading}
        textContent={'Loading Process...'}
        textStyle={{color: '#FFF'}}
      />
      <Spinner
        visible={loadingModal}
        textContent={titelModal}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title="SPL"
        subTitle={
          '#' + route.params.spl_cd + '\n Status : ' + header.status_descs
        }
        // onPress={() => navigation.replace('HistorySPL')}
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.replace('AdminDashboard')}
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
                Please give result for your overtime!
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
      <Modal animationType={'slide'} transparent={false} visible={modalVisible}>
        <View style={global_style.modal_full_opacity}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flex: 1,
              width: '100%',
              marginTop: '80%',
              backgroundColor: 'white',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              paddingHorizontal: 20,
              paddingTop: 30,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <KeyboardAvoidingView enabled>
              <View
                style={{
                  paddingHorizontal: 20,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 24,
                    color: 'black',
                  }}>
                  Please give note before reject this SPL!
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
                  value={remark}
                  onChangeText={value => setRemark(value)}
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
                    setModalVisible(!modalVisible);
                    setRemark('');
                  }}
                  style={{
                    borderRadius: 10,
                    padding: 10,
                    backgroundColor: colorLogo.color1,
                  }}
                />
                <ActionButtonHalf
                  title="Submit"
                  onPress={() => {
                    if (remark != '') {
                      handleConfirmation('reject');
                    } else {
                      Alert.alert('Error', 'Please take note to reject!');
                    }
                  }}
                  style={{
                    borderRadius: 10,
                    padding: 10,
                    backgroundColor: colorLogo.color3,
                  }}
                />
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
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
            {/* <InputUntil title="Work Schedule"/> */}
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

            {/* <InputUntil title="Overtime Projection" /> */}
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, marginRight: 5}}>
                <View style={{marginBottom: 15}}>
                  <Text style={styles.text2}>Overtime Projection</Text>
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
                    value={moment(header.op_from).format('HH:mm')}
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
                    value={moment(header.op_to).format('HH:mm')}
                  />
                </View>
              </View>
            </View>

            <InputForm
              placeholder="Note"
              value={header.note}
              editable={false}
            />
            {checkStatus(header.request_status) && (
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

          {header.request_status == 'waiting' &&
            LoginReducer.form.profile.level == 'Engineer' && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingHorizontal: 20,
                  paddingTop: 20,
                }}>
                <ActionButtonHalf
                  style={{
                    backgroundColor: colorLogo.color1,
                    borderRadius: 25,
                    paddingVertical: 13,
                  }}
                  title="Reject"
                  onPress={() => setModalVisible(!modalVisible)}
                />
                {AreaReducer.available &&
                  AreaReducer.area['entity_project'] +
                    '::' +
                    AreaReducer.area['project_no'] ==
                    header.entity_project + '::' + header.project_no && (
                    <ActionButtonHalf
                      style={{
                        backgroundColor: colorLogo.color4,
                        borderRadius: 25,
                        paddingVertical: 13,
                      }}
                      title="Confirm"
                      onPress={() => handleConfirmation('confirm')}
                    />
                  )}
              </View>
            )}

          {header.request_status == 'waiting' &&
            LoginReducer.form.profile.level == 'Supervisor' && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingHorizontal: 20,
                  paddingTop: 20,
                }}>
                <ActionButtonHalf
                  style={{
                    backgroundColor: colorLogo.color1,
                    borderRadius: 25,
                    paddingVertical: 13,
                  }}
                  title="Cancel"
                  onPress={() => handleConfirmation('cancel')}
                />
              </View>
            )}

          {header.request_status == 'close' &&
            LoginReducer.form.profile.level == 'Supervisor' && (
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
                  onPress={() => handleConfirmation('approve')}
                />
              </View>
            )}

          {header.request_status == 'taken' &&
            LoginReducer.form.profile.level == 'Engineer' && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingHorizontal: 20,
                  paddingTop: 20,
                }}>
                <ActionButtonHalf
                  style={{
                    backgroundColor: colorLogo.color1,
                    borderRadius: 25,
                    paddingVertical: 13,
                  }}
                  title="Close"
                  onPress={() => handleConfirmation('close')}
                />
              </View>
            )}

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

export default ShowSPL;
