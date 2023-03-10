import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
  Pressable,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActionButton,
  ActionButtonAttachmentMultiple,
} from '../../../ActionButton';
import {InputForm, InputTime, SelectDynamic} from '../../../../../component';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import {Body, CheckBox, ListItem} from 'native-base';
import {colorLogo} from '../../../../../utils';
import {global_style} from '../../../../../styles';
import {setRefresh, setTicketStatusIDCorrective} from '../../../../../redux';
import {CorrectiveAPIService} from '../../../../../services';
import Spinner from 'react-native-loading-spinner-overlay';

const FormModifyFixItem = props => {
  console.log('in form modify item fix activity corrective');
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const [showTime, setShowTime] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [needItemParams, setNeedItemParams] = useState([]);
  const [listItem, setListItem] = useState([]);
  const [itemRemark, setItemRemark] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [ids, setIds] = useState(0);
  const [timeTaken, setTimeTaken] = useState(moment().toDate());
  const [fileListMultiple, setFileListMultiple] = useState([[], []]);
  const [fileExistsMultiple, setFileExistsMultiple] = useState([[], []]);
  const subTitleMultiple = ['Before Condition', 'After Condition'];

  const [tempPictureBefore, setTempPictureBefore] = useState([]);
  const [tempPictureAfter, setTempPictureAfter] = useState([]);
  const [activity, setActivity] = useState('');
  const [fullDate, setFullDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState('');
  const [remark, setRemark] = useState('');
  const [itemname, setItemname] = useState('');

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getData();
      getDataRemarks();
      setIds(CorrectiveReducer.stateData.request_item_need.length);
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
        setIsChecked(true);
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

  const getDataRemarks = async () => {
    try {
      const params = {
        ticketNo: CorrectiveReducer.ticket_no,
        runID: CorrectiveReducer.runID,
      };
      console.log(params);
      const res = await CorrectiveAPIService.getListRemarkItemCorrective(
        params,
      );
      setItemRemark([...res.data]);
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

  const setValueQty = (id, value) => {
    setNeedItemParams(state => {
      const data = [...state];
      const index = data.findIndex(item => item.id === id);
      data[index].qty = value.replace(/^0+/, '');
      return data;
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

  const setPrepared = (id, value) => {
    setNeedItemParams(state => {
      const data = [...state];
      const index = data.findIndex(item => item.id === id);
      data[index].preparedBy = value;

      return data;
    });
  };

  const chkbox_check = () => {
    if (isChecked == true) {
      setIsChecked(false);
      setShowRequest(false);
      setNeedItemParams([]);
    } else {
      addCustomField();
      setIsChecked(true);
      setShowRequest(true);
    }
  };

  const addCustomField = () => {
    setIds(ids + 1);
    setNeedItemParams([
      ...needItemParams,
      {
        id: ids,
        runID: null,
        open: false,
        description: null,
        showNote: false,
        qtyOnHand: 0,
        qty: 0,
        value: null,
        isChecked: false,
        items: listItem,
        preparedBy: '',
      },
    ]);
  };

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || timeTaken;
    setShowTime(Platform.OS === 'ios');
    setTimeTaken(currentDate);
  };

  const handleUploadBefore = () => {
    ImagePicker.showImagePicker(
      {
        title: 'Photo/Attachment Before',
        noData: true,
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.5,
        storageOptions: {
          skipBackup: true,
        },
      },
      response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          onSelectedImageBefore(response);
        }
      },
    );
  };
  const onSelectedImageBefore = image => {
    let newDataImg = fileListMultiple;
    const source = {uri: image.uri};
    let item = {
      url: source,
      uri: image.uri,
      type: image.type,
      fileName: image.fileName,
    };
    newDataImg[0].push(item);
    setFileListMultiple(newDataImg);
    setTempPictureBefore(tempPictureBefore.concat(image));
  };

  const handleUploadAfter = () => {
    ImagePicker.showImagePicker(
      {
        title: 'Photo/Attachment After',
        noData: true,
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.5,
        storageOptions: {
          skipBackup: true,
        },
      },
      response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          onSelectedImageAfter(response);
        }
      },
    );
  };

  const onSelectedImageAfter = image => {
    let newDataImg = fileListMultiple;
    const source = {uri: image.uri};
    let item = {
      url: source,
      uri: image.uri,
      type: image.type,
      fileName: image.fileName,
    };
    newDataImg[1].push(item);
    setFileListMultiple(newDataImg);
    setTempPictureAfter(tempPictureAfter.concat(image));
  };

  const HandleUpdateActivity = () => {
    if (activity == '') {
      Alert.alert('Error', 'Please fill in the activity field');
    } else {
      if (isChecked == true) {
        let countError = 0;
        let countErrorQty = 0;
        let countErrorDescription = 0;
        let countErrorPrepared = 0;
        needItemParams.map((resource, index) => {
          if (resource.value == null) {
            countError++;
          } else if (resource.preparedBy == '') {
            countErrorPrepared++;
          } else if (resource.qty == 0 || resource.qty == '') {
            countErrorQty++;
          } else if (resource.value == 0) {
            if (resource.description == null) {
              countErrorDescription++;
            }
          }
        });
        if (countError > 0) {
          Alert.alert(
            'Error',
            'Please fill in the request item field or remove field',
          );
        } else if (countErrorPrepared > 0) {
          Alert.alert('Error', 'Please choose one prepared by');
        } else if (countErrorQty > 0) {
          Alert.alert('Error', 'Please fill in the request item qty');
        } else if (countErrorDescription > 0) {
          Alert.alert('Error', 'Please fill in the description item field');
        } else {
          updateActivity();
        }
      } else {
        updateActivity();
      }
    }
  };

  const updateActivity = async () => {
    try {
      setLoading(true);
      let uploadData = new FormData();
      fileListMultiple[0].map(resources => {
        uploadData.append('file_before[]', {
          type: resources.type,
          uri: resources.uri,
          name: resources.fileName,
        });
      });
      fileListMultiple[1].map(resources => {
        uploadData.append('file_after[]', {
          type: resources.type,
          uri: resources.uri,
          name: resources.fileName,
        });
      });

      uploadData.append('runID', CorrectiveReducer.runID);
      uploadData.append('ticket', CorrectiveReducer.ticket_no);
      uploadData.append('activity', activity);
      uploadData.append('time_taken', moment(timeTaken).format('HH:mm'));
      uploadData.append('username', LoginReducer.form.profile.uid);
      uploadData.append('level', LoginReducer.form.profile.level);
      if (isChecked == true) {
        console.log('true');
        uploadData.append('request_item', 1);
        uploadData.append('request_item_list', JSON.stringify(needItemParams));
      } else {
        uploadData.append('request_item', 0);
      }
      uploadData.append('update_type', 'modify-fix-item');

      // console.log(JSON.stringify(needItemParams));
      const res = await CorrectiveAPIService.updateActivityTakenCorrective(
        uploadData,
      );
      if (res.data.message == 'success') {
        console.log(res.data.status);
        setLoading(false);
        dispatch(setTicketStatusIDCorrective(res.data.status));
        dispatch(setRefresh(true));
        props.navigation.navigate('AdminHelpdeskActivity');
      } else {
        Alert.alert('error', 'Data not save');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error);
    }
  };

  const showModalRemark = item => {
    setModalVisible(!modalVisible);
    let data = itemRemark.find(x => x.item_cd == item);
    setLocation(data.location);
    setRemark(data.remark);
    setItemname(data.item_name);
    console.log(data);
  };

  return (
    <View style={global_style.sub_page}>
      <Spinner
        visible={loading}
        textContent={'Updating Activity...'}
        textStyle={{color: '#FFF'}}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={global_style.modal_full_opacity}>
          <View style={[global_style.modal_full_content, {paddingTop: 0}]}>
            <ScrollView
              style={{width: '100%', marginTop: 20}}
              showsVerticalScrollIndicator={false}>
              <View style={{marginBottom: 10}}>
                <View>
                  <InputForm
                    editable={false}
                    placeholder={'Item'}
                    value={itemname}
                  />
                </View>
                <View>
                  <InputForm
                    editable={false}
                    placeholder={'Location'}
                    value={location}
                  />
                </View>
                <View>
                  <InputForm
                    editable={false}
                    multiline={true}
                    placeholder={'Remarks'}
                    value={remark}
                  />
                </View>
              </View>
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
                  setModalVisible(!modalVisible);
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Close
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
          <ActionButtonAttachmentMultiple
            title="Attachment"
            onPress={[() => handleUploadBefore(), () => handleUploadAfter()]}
            list={fileListMultiple}
            fileExists={fileExistsMultiple}
            subTitle={subTitleMultiple}
          />

          {showRequest &&
            needItemParams.map(user => (
              <View style={{marginTop: 10, borderBottomWidth: 1}} key={user.id}>
                <SelectDynamic
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
                  deleted={false}
                  disabled={true}
                  editable={false}
                  onPress={() => deleteField(user.id)}
                  valQty={user.qty}
                  valOnHand={user.qtyOnHand.toString()}
                  onChangeText={val => setValueQty(user.id, val)}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1, paddingRight: 10}}>
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
                        placeholder="Qty"
                        keyboardType="numeric"
                        value={user.qty}
                        onChangeText={val => setValueQty(user.id, val)}
                      />
                    </View>
                  </View>
                </View>

                {user.showNote && (
                  <View style={{marginTop: 5}}>
                    <InputForm
                      editable={false}
                      placeholder={'Description'}
                      value={user.description}
                      onChangeText={val => setValueDescription(user.id, val)}
                    />
                  </View>
                )}
                {itemRemark.some(x => x.item_cd == user.value) && (
                  <TouchableOpacity
                    style={{marginBottom: 10}}
                    onPress={() => showModalRemark(user.value)}>
                    <Text style={{fontWeight: 'bold', color: 'red'}}>
                      SHOW REMARKS
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          <ListItem style={{paddingLeft: 0, marginLeft: 0}} noBorder>
            <CheckBox
              checked={isChecked}
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
                Need Request Item
              </Text>
            </Body>
          </ListItem>
        </View>
        <View style={{marginBottom: 10}}>
          <ActionButton title="Update" onPress={() => HandleUpdateActivity()} />
        </View>
      </ScrollView>
    </View>
  );
};

export default FormModifyFixItem;
