import React, {useState, useCallback, useEffect} from 'react';
import {View, ScrollView, Alert, Text} from 'react-native';
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
      const index = data.findIndex(item => item.id === id);
      data[index].qty = value.replace(/^0+/, '');
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
        const index = _state.findIndex(item => item.id === id);
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
      const index = _state.findIndex(item => item.id === id);
      _state[index].open = open;

      return _state;
    });
  };

  const setValue = useCallback((id, callback) => {
    setNeedItemParams(state => {
      const _state = [...state];
      const index = _state.findIndex(item => item.id === id);
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
        const indexItem = listItem.findIndex(
          item => item.item_code === item_cd,
        );
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
      const index = _state.findIndex(item => item.id === id);
      _state[index].showNote = _val;
      _state[index].qtyOnHand = onHandQty;

      return _state;
    });
  };

  const confirmItemAvailable = () => {
    let countChecked = 0;
    for (let index = 0; index < needItemParams.length; index++) {
      if (needItemParams[index].isChecked === false) {
        countChecked++;
      }
      if (needItemParams[index].qty > needItemParams[index].qtyOnHand) {
        Alert.alert('Error', 'On hand must be greater than qty request');
        return false;
      }
    }
    if (countChecked === needItemParams.length) {
      Alert.alert('Error', 'Sorry, please select item to confirm');
    } else {
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

  const confirmHoldTicket = () => {
    // let countChecked = 0;
    // for (let index = 0; index < needItemParams.length; index++) {
    //   if (needItemParams[index].isChecked === false) {
    //     countChecked++;
    //   }
    // }
    // if (countChecked === needItemParams.length) {
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
      const index = data.findIndex(item => item.id === id);
      if (data[index].isChecked == true) {
        data[index].isChecked = false;
      } else {
        data[index].isChecked = true;
      }
      return data;
    });
  };

  return (
    <View style={global_style.sub_page}>
      <Spinner
        visible={loading}
        textContent={'Updating Activity...'}
        textStyle={{color: '#FFF'}}
      />
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
