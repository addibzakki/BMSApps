import React, {useState, useCallback, useEffect} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActionButton,
  ActionButtonAttachmentMultipleShow,
} from '../../../ActionButton';
import {
  InputForm,
  InputTime,
  SelectChecklistShow,
  sendNotificationOneSignal,
} from '../../../../../component';
import moment from 'moment';
import {global_style} from '../../../../../styles';
import {CorrectiveAPIService} from '../../../../../services';
import Spinner from 'react-native-loading-spinner-overlay';
import {setRefresh, setTicketStatusIDCorrective} from '../../../../../redux';

const FormConfirmItem = props => {
  console.log('in page item confirm');
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

  const handleOnSearch = async (id, text) => {
    setLoadingSearch(true);
    try {
      const params = {
        text: text,
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

  const setValueDescription = (id, value) => {
    setNeedItemParams(state => {
      const data = [...state];
      const index = data.findIndex(item => item.id === id);
      data[index].description = value;
      return data;
    });
  };

  const setValue = useCallback((id, callback) => {
    setNeedItemParams(state => {
      const _state = [...state];
      const index = _state.findIndex(item => item.id === id);
      _state[index].value = callback(_state[index].value);
      // console.log(_state);
      return _state;
    });
  }, []);

  const handleSetItem = (id, showNote) => {
    if (showNote == '0') {
      var _val = true;
      var onHandQty = 0;
    } else {
      var _val = false;
      if (listItem !== []) {
        const indexItem = listItem.findIndex(
          item => item.item_code === showNote,
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

  const deleteField = id => {
    setNeedItemParams(state => {
      const _state = [...state];
      const index = _state
        .map(function(item) {
          return item.id;
        })
        .indexOf(id);
      _state.splice(index, 1);
      return _state;
    });
  };

  const confirmItem = () => {
    let countChecked = 0;
    let countGreater = 0;
    for (let index = 0; index < needItemParams.length; index++) {
      if (needItemParams[index].isChecked === false) {
        countChecked++;
      }
      if (needItemParams[index].qty > needItemParams[index].qtyOnHand) {
        countGreater++;
      }
    }
    if (countChecked === needItemParams.length) {
      Alert.alert('Error', 'Sorry, please select item to release');
    } else if (countGreater > 0) {
      Alert.alert('Error', 'On hand must be greater than qty request');
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
          {text: 'Yes, Sure!', onPress: () => HandleConfirmItem()},
        ],
      );
    }
  };

  const HandleConfirmItem = async () => {
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
        Alert.alert('error', 'Data not save');
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
                <SelectChecklistShow
                  listMode="MODAL"
                  modalProps={{
                    animationType: 'Slide',
                  }}
                  searchable={true}
                  loading={loadingSearch}
                  disableLocalSearch={true}
                  onChangeSearchText={text => handleOnSearch(user.id, text)}
                  key={user.id}
                  open={user.open}
                  value={user.value}
                  items={user.items}
                  setOpen={open => setOpen(user.id, open)}
                  setValue={callback => setValue(user.id, callback)}
                  onChangeValue={val => {
                    handleSetItem(user.id, val);
                  }}
                  itemSeparator={true}
                  placeholderItem={'Item'}
                  placeholderQty={'Qty'}
                  disabled={true}
                  editable={false}
                  onPress={() => deleteField(user.id)}
                  checked={() => chkbox_checked(user.id)}
                  valOnHand={user.qtyOnHand.toString()}
                  valQty={user.qty}
                  preparedBy={user.preparedBy == 'E' ? 'Tenant' : 'MMP'}
                  description={user.description}
                  valChecked={user.isChecked}
                />
              </View>
            ))}
        </View>
        <View style={{marginTop: 10, marginBottom: 10}}>
          <ActionButton title="Release Item" onPress={() => confirmItem()} />
        </View>
      </ScrollView>
    </View>
  );
};

export default FormConfirmItem;
