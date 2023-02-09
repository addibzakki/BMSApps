import React, {useState, useCallback, useEffect} from 'react';
import {View, ScrollView, Alert, Text, Modal, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActionButtonAttachmentMultipleShow,
  ActionButtonHalf,
} from '../../../ActionButton';
import {
  InputForm,
  InputTime,
  sendNotificationOneSignal,
} from '../../../../../component';
import moment from 'moment';
import {colorLogo} from '../../../../../utils';
import {global_style} from '../../../../../styles';
import {CorrectiveAPIService} from '../../../../../services';
import Spinner from 'react-native-loading-spinner-overlay';
import {setRefresh, setTicketStatusIDCorrective} from '../../../../../redux';
import {CheckBox} from 'native-base';
import DropDownPicker from 'react-native-dropdown-picker';
const FormConfirmAvailableItem = props => {
  console.log('in form item confirm before choose hold or available');
  const dispatch = useDispatch();
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const LoginReducer = useSelector(state => state.LoginReducer);
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [needItemParams, setNeedItemParams] = useState([]);
  const [listItem, setListItem] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [timeTaken, setTimeTaken] = useState(moment().toDate());
  const [fileExistsMultiple, setFileExistsMultiple] = useState([[], []]);
  const subTitleMultiple = ['Before Condition', 'After Condition'];
  const [activity, setActivity] = useState('');
  const [fullDate, setFullDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemRelease, setItemRelease] = useState([]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getData();
      setFullDate(
        days[moment(CorrectiveReducer.stateData.created_date).day()] +
          ', ' +
          moment(CorrectiveReducer.stateData.created_date).format('DD MMMM Y'),
      );
      setTimeTaken(moment(CorrectiveReducer.stateData.time_taken).toDate());
      setActivity(CorrectiveReducer.stateData.description);
      if (CorrectiveReducer.stateData.attachment != '') {
        CorrectiveReducer.stateData.attachment.map(resources => {
          const source = {
            uri: resources,
          };
          let item = {
            url: source,
          };
          fileExistsMultiple[0].push(item);
        });
        setFileExistsMultiple(fileExistsMultiple);
      }

      if (CorrectiveReducer.stateData.attachment_after != '') {
        CorrectiveReducer.stateData.attachment_after.map(resources => {
          const source = {
            uri: resources,
          };
          let item = {
            url: source,
          };
          fileExistsMultiple[1].push(item);
        });
        setFileExistsMultiple(fileExistsMultiple);
      }

      if (CorrectiveReducer.stateData.request_item > 0) {
        setShowRequest(true);
        setNeedItemParams(CorrectiveReducer.stateData.request_item_need);
      }
    });
    return unsubscribe;
  }, [props]);

  const getData = async () => {
    try {
      const params = {
        ticketNo: CorrectiveReducer.ticket_no,
      };
      const res = await CorrectiveAPIService.getListItemCorrective(params);
      setListItem([...res.data]);
    } catch (error) {
      Alert.alert('Error', error);
      console.log(error);
    }
  };

  const setValueQty = (id, value) => {
    setNeedItemParams(state => {
      const data = [...state];
      const index = data.findIndex(item => item.id == id);
      data[index].qty = value.replace(/^0+/, '');
      return data;
    });
  };

  const setLocation = (id, value) => {
    setItemRelease(state => {
      const data = [...state];
      const index = data.findIndex(item => item.id == id);
      data[index].location = value;
      return data;
    });
  };
  const setJustification = (id, value) => {
    setItemRelease(state => {
      const data = [...state];
      const index = data.findIndex(item => item.id == id);
      data[index].justification = value;
      return data;
    });
  };

  const handleOnSearch = async (id, text) => {
    setLoadingSearch(true);
    try {
      const params = {
        text: text,
        ticketNo: CorrectiveReducer.ticket_no,
      };
      const res = await CorrectiveAPIService.submitSearchItemCorrective(params);
      setNeedItemParams(state => {
        const _state = [...state];
        const index = _state.findIndex(item => item.id == id);
        _state[index].items = res.data;

        return _state;
      });
      setLoadingSearch(false);
    } catch (error) {
      Alert.alert('Error');
      setLoadingSearch(false);
    }
  };

  const setOpen = (id, open) => {
    setNeedItemParams(state => {
      const _state = [...state];
      const index = _state.findIndex(item => item.id == id);
      _state[index].open = open;

      return _state;
    });
  };

  const setValue = useCallback((id, callback) => {
    setNeedItemParams(state => {
      const _state = [...state];
      const index = _state.findIndex(item => item.id == id);
      _state[index].value = callback(_state[index].value);
      return _state;
    });
  }, []);

  const handleSetItem = (id, item_cd) => {
    if (item_cd == '0') {
      var _val = true;
      var onHandQty = 0;
    } else {
      var _val = false;
      if (listItem !== []) {
        const indexItem = listItem.findIndex(item => item.item_code == item_cd);
        console.log(indexItem);
        if (indexItem < 0) {
          var onHandQty = 0;
        } else {
          var onHandQty = listItem[indexItem]['onhand_qty'];
        }
      } else {
        var onHandQty = 0;
      }
    }
    setNeedItemParams(state => {
      const _state = [...state];
      const index = _state.findIndex(item => item.id == id);
      _state[index].showNote = _val;
      _state[index].qtyOnHand = onHandQty;

      return _state;
    });
  };

  const confirmItemAvailable = () => {
    let countChecked = 0;
    for (let index = 0; index < needItemParams.length; index++) {
      if (needItemParams[index].isChecked == false) {
        countChecked++;
      }
    }
    if (countChecked == needItemParams.length) {
      Alert.alert('Error', 'Sorry, please select item to confirm');
    } else {
      for (let i = 0; i < needItemParams.length; i++) {
        if (needItemParams[i].qty > needItemParams[i].qtyOnHand) {
          Alert.alert('Error', 'On hand must be greater than qty request', [
            {
              text: 'Ok',
            },
            {
              text: 'Keep release with note',
              onPress: () => {
                let mergeItem = [];
                needItemParams
                  .filter(function(item) {
                    return item.qtyOnHand == '0';
                  })
                  .map(items => {
                    mergeItem.push(
                      Object.assign(items, {
                        location: '',
                        justification: '',
                      }),
                    );
                  });

                setItemRelease(mergeItem);
                console.log(itemRelease);
                setModalVisible(!modalVisible);
              },
            },
          ]);
          return false;
        }
      }
      Alert.alert(
        'Confirmation!',
        'Are you sure want to confirm this item available and ready to use?',
        [
          {
            text: 'No',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {text: 'Yes, Sure!', onPress: () => handleItemAvailable()},
        ],
      );
    }
  };

  const handleItemAvailable = async () => {
    try {
      setLoading(true);
      let uploadData = new FormData();
      uploadData.append('runID', CorrectiveReducer.runID);
      uploadData.append('request_item_list', JSON.stringify(needItemParams));
      uploadData.append('ticketNo', CorrectiveReducer.ticket_no);

      const res = await CorrectiveAPIService.submitConfirmItemCorrective(
        uploadData,
      );
      if (res.data.message == 'success') {
        setLoading(false);
        sendNotificationOneSignal(
          res.data.notification.subtitle,
          res.data.notification.activity,
          res.data.notification.player_ids,
        );
        dispatch(setTicketStatusIDCorrective(res.data.status));
        dispatch(setRefresh(true));
        props.navigation.replace('AdminHelpdeskActivity');
      } else {
        Alert.alert('error', res.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error);
    }
  };

  const validationReleaseUrgent = () => {
    let countErrorLocation = 0;
    let countErrorJustification = 0;
    itemRelease.map((resource, index) => {
      if (resource.location == '') {
        countErrorLocation++;
      } else if (resource.justification == '') {
        countErrorJustification++;
      }
    });
    if (countErrorLocation > 0) {
      Alert.alert('Error', 'Please fill in the location item field');
    } else if (countErrorJustification > 0) {
      Alert.alert('Error', 'Please fill in the remarks field');
    } else {
      Alert.alert('Confirmation!', 'Are you sure want to release this item?', [
        {
          text: 'No',
          onPress: () => console.log('cancel'),
          style: 'cancel',
        },
        {text: 'Yes, Sure!', onPress: () => handleReleaseItemUrgent()},
        // {text: 'Yes, Sure!', onPress: () => console.log(itemRelease)},
      ]);
    }
  };

  const handleReleaseItemUrgent = async () => {
    try {
      setLoading(true);
      let uploadData = new FormData();
      uploadData.append('runID', CorrectiveReducer.runID);
      uploadData.append('request_item_list', JSON.stringify(needItemParams));
      uploadData.append('request_item_urgent', JSON.stringify(itemRelease));
      uploadData.append('supervisor', LoginReducer.form.profile.uid);
      uploadData.append('ticketNo', CorrectiveReducer.ticket_no);
      const res = await CorrectiveAPIService.submitConfirmItemCorrective(
        uploadData,
      );
      if (res.data.message == 'success') {
        setLoading(false);
        sendNotificationOneSignal(
          res.data.notification.subtitle,
          res.data.notification.activity,
          res.data.notification.player_ids,
        );
        dispatch(setTicketStatusIDCorrective(res.data.status));
        dispatch(setRefresh(true));
        setModalVisible(!modalVisible);
        props.navigation.replace('AdminHelpdeskActivity');
      } else {
        // Alert.alert('error', res.data.message);
        console.log(res.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error);
    }
  };

  const confirmHoldTicket = () => {
    // let countChecked = 0;
    // for (let index = 0; index < needItemParams.length; index++) {
    //   if (needItemParams[index].isChecked == false) {
    //     countChecked++;
    //   }
    // }
    // if (countChecked == needItemParams.length) {
    //   Alert.alert('Error', 'Sorry, please select item to hold');
    // } else {
    Alert.alert('Confirmation!', 'Are you sure want to hold this ticket?', [
      {
        text: 'No',
        onPress: () => console.log('cancel'),
        style: 'cancel',
      },
      {text: 'Yes, Sure!', onPress: () => handleHoldTicket()},
    ]);
    // }
  };

  const handleHoldTicket = async () => {
    try {
      setLoading(true);
      const params = {
        ticketNo: CorrectiveReducer.ticket_no,
        username: LoginReducer.form.profile.uid,
      };
      const res = await CorrectiveAPIService.submitHoldTicketCorrective(params);
      if (res.data.message == 'success') {
        setLoading(false);
        sendNotificationOneSignal(
          res.data.notification.subtitle,
          res.data.notification.activity,
          res.data.notification.player_ids,
        );
        dispatch(setTicketStatusIDCorrective(res.data.status));
        dispatch(setRefresh(true));
        props.navigation.replace('AdminHelpdeskActivity');
      } else {
        Alert.alert('error', 'Data not update');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error);
    }
  };

  const chkbox_checked = id => {
    setNeedItemParams(state => {
      const data = [...state];
      const index = data.findIndex(item => item.id == id);
      if (data[index].isChecked == true) {
        data[index].isChecked = false;
      } else {
        data[index].isChecked = true;
      }
      return data;
    });
  };

  console.log(needItemParams);

  return (
    <View style={global_style.sub_page}>
      <Spinner
        visible={loading}
        textContent={'Updating Activity...'}
        textStyle={{color: '#FFF'}}
      />
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
          }}>
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 35,
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
            <Text
              style={{
                marginBottom: 15,
                textAlign: 'center',
              }}>
              Hello World!
            </Text>
            <Pressable
              style={[
                {
                  borderRadius: 20,
                  padding: 10,
                  elevation: 2,
                },
                {
                  backgroundColor: '#2196F3',
                },
              ]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Hide Modal
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={global_style.modal_full_opacity}>
          <View style={[global_style.modal_full_content, {paddingTop: 0}]}>
            <ScrollView
              style={{width: '100%', marginTop: 20}}
              showsVerticalScrollIndicator={false}>
              {itemRelease.map(user => (
                <View
                  key={user.id}
                  style={{borderBottomWidth: 1, marginBottom: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{width: '80%'}}>
                      <Text
                        style={{
                          fontSize: 12,
                          textTransform: 'capitalize',
                          fontWeight: 'bold',
                          color: colorLogo.color3,
                          marginBottom: 5,
                        }}>
                        {'Item'}
                      </Text>
                      <DropDownPicker
                        style={{height: 40}}
                        listMode="MODAL"
                        modalProps={{
                          animationType: 'Slide',
                        }}
                        disabled={true}
                        searchable={true}
                        loading={loadingSearch}
                        disableLocalSearch={true}
                        onChangeSearchText={text =>
                          handleOnSearch(user.id, text)
                        }
                        key={user.id}
                        open={user.open}
                        value={user.value}
                        items={user.items}
                        setOpen={open => setOpen(user.id, open)}
                        setValue={callback => setValue(user.id, callback)}
                        onChangeValue={val => {
                          handleSetItem(user.id, val);
                        }}
                      />
                    </View>
                    <View style={{width: '15%'}}>
                      <InputForm
                        editable={false}
                        placeholder={'Qty'}
                        keyboardType="numeric"
                        value={user.qty}
                        onChangeText={val => setValueQty(user.id, val)}
                      />
                    </View>
                  </View>
                  <View>
                    <InputForm
                      editable={true}
                      placeholder={'Location'}
                      value={user.location}
                      onChangeText={val => setLocation(user.id, val)}
                    />
                  </View>
                  <View>
                    <InputForm
                      editable={true}
                      multiline={true}
                      placeholder={'Remarks'}
                      value={user.justification}
                      onChangeText={val => setJustification(user.id, val)}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={[
                  {
                    borderRadius: 20,
                    padding: 10,
                    elevation: 2,
                    margin: 10,
                  },
                  {
                    backgroundColor: 'red',
                  },
                ]}
                onPress={() => {
                  setItemRelease([]);
                  setModalVisible(!modalVisible);
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[
                  {
                    borderRadius: 20,
                    padding: 10,
                    elevation: 2,
                    margin: 10,
                  },
                  {
                    backgroundColor: 'green',
                  },
                ]}
                onPress={() => validationReleaseUrgent()}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Release
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={global_style.content}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '65%'}}>
              <InputForm placeholder="date" value={fullDate} editable={false} />
            </View>
            <View style={{width: '30%'}}>
              <InputTime
                placeholder="time taken"
                value={timeTaken ? moment(timeTaken).format('HH:mm') : ''}
                editable={false}
              />
            </View>
          </View>
          <InputForm
            placeholder="activity"
            value={activity}
            multiline={true}
            onChangeText={value => setActivity(value)}
          />
          <ActionButtonAttachmentMultipleShow
            title="Attachment"
            fileExists={fileExistsMultiple}
            subTitle={subTitleMultiple}
          />
          {showRequest &&
            needItemParams.map(user => (
              <View style={{marginTop: 10}} key={user.id}>
                <View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <View style={{paddingRight: 20, justifyContent: 'center'}}>
                      <CheckBox
                        onPress={() => chkbox_checked(user.id)}
                        checked={user.isChecked}
                        style={{
                          paddingLeft: 0,
                          marginLeft: 0,
                          marginTop: 0,
                          paddingTop: 0,
                        }}
                      />
                    </View>

                    <View style={{flex: 1, paddingRight: 10}}>
                      <Text
                        style={{
                          fontSize: 12,
                          textTransform: 'capitalize',
                          fontWeight: 'bold',
                          color: colorLogo.color3,
                          marginBottom: 5,
                        }}>
                        {'Item'}
                      </Text>
                      <DropDownPicker
                        style={{height: 40}}
                        listMode="MODAL"
                        modalProps={{
                          animationType: 'Slide',
                        }}
                        disabled={true}
                        searchable={true}
                        loading={loadingSearch}
                        disableLocalSearch={true}
                        onChangeSearchText={text =>
                          handleOnSearch(user.id, text)
                        }
                        key={user.id}
                        open={user.open}
                        value={user.value}
                        items={user.items}
                        setOpen={open => setOpen(user.id, open)}
                        setValue={callback => setValue(user.id, callback)}
                        onChangeValue={val => {
                          handleSetItem(user.id, val);
                        }}
                      />
                    </View>

                    <View style={{paddingRight: 10}}>
                      <View>
                        <InputForm
                          editable={true}
                          placeholder={'Qty'}
                          keyboardType="numeric"
                          value={user.qty}
                          onChangeText={val => setValueQty(user.id, val)}
                        />
                      </View>
                    </View>
                  </View>
                  {user.description != null && (
                    <View style={{paddingLeft: 40}}>
                      <InputForm
                        editable={false}
                        placeholder="Description"
                        value={user.description}
                      />
                    </View>
                  )}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <View style={{flex: 1, paddingLeft: 40, paddingRight: 10}}>
                      <InputForm
                        editable={false}
                        placeholder="Prepared By"
                        value={user.preparedBy == 'E' ? 'Tenant' : 'MMP'}
                      />
                    </View>
                    <View style={{paddingRight: 10}}>
                      <View>
                        <InputForm
                          editable={false}
                          placeholder="Onhand"
                          value={user.qtyOnHand.toString()}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
        </View>
        <View style={{marginTop: 10, marginBottom: 10}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              paddingHorizontal: 15,
            }}>
            <ActionButtonHalf
              style={{
                backgroundColor: colorLogo.color4,
                borderRadius: 25,
                paddingVertical: 13,
              }}
              title="Item Available"
              onPress={() => confirmItemAvailable()}
            />
            <ActionButtonHalf
              style={{
                backgroundColor: colorLogo.color1,
                borderRadius: 25,
                paddingVertical: 13,
              }}
              title="Hold Ticket"
              onPress={() => confirmHoldTicket()}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FormConfirmAvailableItem;
