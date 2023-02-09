import React, {useState, useCallback, useEffect, useContext} from 'react';
import {View, ScrollView, Text, Alert, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActionButton,
  ActionButtonAttachmentMultiple,
} from '../../../ActionButton';
import {InputForm, InputTime, SelectDynamic} from '../../../../../component';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {Body, CheckBox, ListItem} from 'native-base';
import {colorLogo} from '../../../../../utils';
import {global_style} from '../../../../../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  setTicketStatusIDCorrective,
  setTicketStatusTenantCorrective,
} from '../../../../../redux';
import {CorrectiveAPIService} from '../../../../../services';
import Spinner from 'react-native-loading-spinner-overlay';
import BackgroundJob from 'react-native-background-job';
import {store_cm_action} from '../../../../../component/databases/store/store_cm_action_tmp';
import GlobalContext from '../../../../../component/GlobalContext';
import {sendNotificationOneSignal} from '../../../../../component';
import {command} from '../../../../../component/chalk';

const FormCreate = props => {
  console.log('in form create corrective');
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
  const [isChecked, setIsChecked] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [ids, setIds] = useState(0);
  const [timeTaken, setTimeTaken] = useState(moment().toDate());
  const [fileListMultiple, setFileListMultiple] = useState([[], []]);
  const [fileExistsMultiple, setFileExistsMultiple] = useState([[], []]);
  const subTitleMultiple = ['Before Condition', 'After Condition'];
  const [tempPictureAfter, setTempPictureAfter] = useState([]);
  const [tempPictureBefore, setTempPictureBefore] = useState([]);
  const [activity, setActivity] = useState('');
  const full_date =
    days[new Date().getDay()] + ', ' + moment().format('DD MMMM Y');
  const [loading, setLoading] = useState(false);
  const networkContext = useContext(GlobalContext);

  BackgroundJob.register({
    jobKey: 'wait_sending',
    job: () => {
      store_cm_action(db, LoginReducer);
      cmd.purple('Background Job fired for : All job pending');
    },
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [props]);

  const getData = async () => {
    if (networkContext.networkInfo == true) {
      try {
        const params = {
          ticketNo: CorrectiveReducer.ticket_no,
        };
        console.log(params);
        const res = await CorrectiveAPIService.getListItemCorrective(params);
        setListItem([...res.data]);
      } catch (error) {
        Alert.alert('Error', error);
        console.log(error);
      }
    } else {
      try {
        var temp = [];
        db.transaction(txn => {
          txn.executeSql(
            'SELECT a.item_cd, a.descs_mobile||"-"||a.uom AS descs, CASE WHEN b.onhand_qty IS NULL THEN 0 ELSE b.onhand_qty END AS onhand_qty FROM cm_item_tmp a LEFT JOIN cm_onhand_tmp b ON a.item_cd = b.item_cd AND b.entity_project = (SELECT entity_project FROM cm_tenant_ticket_tmp WHERE tenant_ticket_id = ?) ORDER BY a.descs_mobile LIMIT 10',
            [CorrectiveReducer.ticket_no],
            (txn, res) => {
              temp.push({
                label: 'Request Item',
                item_code: '0',
                value: '0',
                item_name: 'Request Item',
                onhand_qty: '0',
              });
              for (let i = 0; i < res.rows.length; ++i) {
                temp.push({
                  label: res.rows.item(i)['descs'],
                  item_code: res.rows.item(i)['item_code'],
                  value: res.rows.item(i)['value'],
                  item_name: res.rows.item(i)['descs'],
                  onhand_qty: res.rows.item(i)['onhand_qty'],
                });
              }
              setListItem([...temp]);
            },
            error => {
              cmd.red(
                'error on query table cm_tenant_ticket_tmp ' + error.message,
              );
            },
          );
        });
      } catch (error) {
        Alert.alert('Error', error.message);
        cmd.red('error on query table cm_tenant_ticket_tmp ' + error.message);
      }
    }
  };

  const handleOnSearch = async (id, text) => {
    setLoadingSearch(true);
    try {
      if (networkContext.networkInfo == true) {
        const params = {
          text: text,
          ticketNo: CorrectiveReducer.ticket_no,
        };
        const res = await CorrectiveAPIService.submitSearchItemCorrective(
          params,
        );
        setListItem([...res.data]);
        setNeedItemParams(state => {
          const _state = [...state];
          const index = _state.findIndex(item => item.id == id);
          _state[index].items = res.data;
          return _state;
        });
        setLoadingSearch(false);
      } else {
        var temp = [];
        db.transaction(txn => {
          txn.executeSql(
            'SELECT a.item_cd, a.descs_mobile||"-"||a.uom AS descs, CASE WHEN b.onhand_qty IS NULL THEN 0 ELSE b.onhand_qty END AS onhand_qty FROM cm_item_tmp a LEFT JOIN cm_onhand_tmp b ON a.item_cd = b.item_cd AND b.entity_project = (SELECT entity_project FROM cm_tenant_ticket_tmp WHERE tenant_ticket_id = ?) WHERE a.descs_mobile LIKE ? || "%"  ORDER BY a.descs_mobile LIMIT 10',
            [CorrectiveReducer.ticket_no, text],
            (txn, res) => {
              temp.push({
                label: 'Request Item',
                item_code: '0',
                value: '0',
                item_name: 'Request Item',
                onhand_qty: '0',
              });
              for (let i = 0; i < res.rows.length; ++i) {
                temp.push({
                  label: res.rows.item(i)['descs'],
                  item_code: res.rows.item(i)['item_code'],
                  value: res.rows.item(i)['value'],
                  item_name: res.rows.item(i)['descs'],
                  onhand_qty: res.rows.item(i)['onhand_qty'],
                });
              }
              setListItem([...temp]);
              setNeedItemParams(state => {
                const _state = [...state];
                const index = _state.findIndex(item => item.id == id);
                _state[index].items = temp;
                return _state;
              });
              setLoadingSearch(false);
            },
            error => {
              cmd.red(
                'error on query table cm_tenant_ticket_tmp ' + error.message,
              );
            },
          );
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
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

  const setValueQty = (id, value) => {
    setNeedItemParams(state => {
      const data = [...state];
      const index = data.findIndex(item => item.id == id);
      data[index].qty = value.replace(/^0+/, '');
      return data;
    });
  };

  const setValueDescription = (id, value) => {
    setNeedItemParams(state => {
      const data = [...state];
      const index = data.findIndex(item => item.id == id);
      data[index].description = value;
      return data;
    });
  };

  const setValue = useCallback((id, callback) => {
    setNeedItemParams(state => {
      const _state = [...state];
      const index = _state.findIndex(item => item.id == id);
      _state[index].value = callback(_state[index].value);
      // console.log(_state);
      return _state;
    });
  }, []);

  const handleSetItem = async (id, item_cd) => {
    if (item_cd == '0') {
      var _val = true;
      var onHandQty = 0;
    } else {
      var _val = false;
      if (listItem !== []) {
        const indexItem = listItem.findIndex(item => item.item_code == item_cd);
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
      const index = data.findIndex(item => item.id == id);
      data[index].preparedBy = value;

      return data;
    });
  };

  const chkbox_check = () => {
    if (networkContext.networkInfo == false) {
      Alert.alert(
        'Attention',
        'Sorry, please use a good network to access this feature',
      );
    } else {
      if (isChecked == true) {
        setIsChecked(false);
        setShowRequest(false);
        setNeedItemParams([]);
      } else {
        addCustomField();
        setIsChecked(true);
        setShowRequest(true);
      }
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
    setShowTime(Platform.OS == 'ios');
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

  const HandleSubmitActivity = () => {
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
          submitActivity();
        }
      } else {
        submitActivity();
      }
    }
  };

  const transmitData = () => {
    BackgroundJob.schedule({
      period: 2000,
      allowExecutionInForeground: true,
      exact: true,
      networkType: BackgroundJob.NETWORK_TYPE_UNMETERED,
      notificationText: 'Process post action running in background',
      notificationTitle: 'Building Management System',
      jobKey: 'wait_sending',
    });
  };

  const submitActivity = async () => {
    try {
      if (networkContext.networkInfo == true) {
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
        uploadData.append('ticket', CorrectiveReducer.ticket_no);
        uploadData.append('activity', activity);
        uploadData.append('time_taken', moment(timeTaken).format('HH:mm'));
        uploadData.append('username', LoginReducer.form.profile.uid);
        uploadData.append('level', LoginReducer.form.profile.level);
        if (isChecked == true) {
          uploadData.append('request_item', 1);
          uploadData.append(
            'request_item_list',
            JSON.stringify(needItemParams),
          );
        } else {
          uploadData.append('request_item', 0);
        }

        console.log(uploadData);
        const res = await CorrectiveAPIService.submitActivityTakenCorrective(
          uploadData,
        );
        if (res.data.message == 'success') {
          command.blue(res.data.player_ids);
          sendNotificationOneSignal(
            res.data.notification.subtitle,
            res.data.notification.activity,
            res.data.player_ids,
          );
          setLoading(false);
          dispatch(
            setTicketStatusIDCorrective(
              res.data.status == 'error'
                ? CorrectiveReducer.ticket_status_id
                : res.data.status,
            ),
          );
          dispatch(
            setTicketStatusTenantCorrective(
              res.data.status_tenant == 'error'
                ? CorrectiveReducer.ticket_status_tenant
                : res.data.status_tenant,
            ),
          );
          props.navigation.replace('AdminHelpdeskActivity');
        } else {
          Alert.alert('error', 'Data not save');
          setLoading(false);
        }
      } else {
        setLoading(true);
        let photos_before = [];
        tempPictureBefore.map(res => {
          photos_before.push(res.uri);
        });
        let photos_after = [];
        tempPictureAfter.map(res => {
          photos_after.push(res.uri);
        });
        db.transaction(txn => {
          txn.executeSql(
            'INSERT INTO cm_action_tmp (tenant_ticket_id,engineering_username,description,attachment,attachment_after,status_id,time_taken,request_item, status_job) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              CorrectiveReducer.ticket_no,
              LoginReducer.form.profile.uid,
              activity,
              tempPictureBefore.length > 0 ? photos_before.join(';;') : null,
              tempPictureAfter.length > 0 ? photos_after.join(';;') : null,
              isChecked == true ? 12 : 2,
              moment(timeTaken).format('HH:mm'),
              isChecked == true ? 1 : 0,
              'waiting',
            ],
            (txn, res) => {
              if (res.rowsAffected > 0) {
                if (isChecked == true) {
                  txn.executeSql(
                    'UPDATE cm_tenant_ticket_tmp SET status_id = 12, status_tenant = 2 WHERE tenant_ticket_id = ?',
                    [CorrectiveReducer.ticket_no],
                    (txn, res) => {
                      if (res.rowsAffected > 0) {
                        txn.executeSql(
                          'SELECT status_id, status_tenant FROM cm_tenant_ticket_tmp WHERE tenant_ticket_id = ?',
                          [CorrectiveReducer.ticket_no],
                          (txn, res) => {
                            dispatch(
                              setTicketStatusIDCorrective(
                                res.rows.item(0)['status_id'],
                              ),
                            );
                            dispatch(
                              setTicketStatusTenantCorrective(
                                res.rows.item(0)['status_tenant'],
                              ),
                            );
                            setLoading(false);
                            transmitData();
                            props.navigation.replace('AdminHelpdeskActivity');
                          },
                          error => {
                            cmd.red(
                              'error on insert table cm_action_tmp ' +
                                error.message,
                            );
                            Alert.alert(
                              'error',
                              'Submit action recording failed',
                            );
                            setLoading(false);
                          },
                        );
                      }
                    },
                    error => {
                      cmd.red(
                        'error on insert table cm_action_tmp ' + error.message,
                      );
                      Alert.alert('error', 'Submit action recording failed');
                      setLoading(false);
                    },
                  );
                } else {
                  txn.executeSql(
                    'SELECT status_id, status_tenant FROM cm_tenant_ticket_tmp WHERE tenant_ticket_id = ?',
                    [CorrectiveReducer.ticket_no],
                    (txn, res) => {
                      dispatch(
                        setTicketStatusIDCorrective(
                          res.rows.item(0)['status_id'],
                        ),
                      );
                      dispatch(
                        setTicketStatusTenantCorrective(
                          res.rows.item(0)['status_tenant'],
                        ),
                      );
                      transmitData();
                      setLoading(false);
                      props.navigation.replace('AdminHelpdeskActivity');
                    },
                    error => {
                      cmd.red(
                        'error on insert table cm_action_tmp ' + error.message,
                      );
                      Alert.alert('error', 'Submit action recording failed');
                      setLoading(false);
                    },
                  );
                }
                cmd.green('Data action has been record');
              }
            },
            error => {
              cmd.red('error on insert table cm_action_tmp ' + error.message);
              Alert.alert('error', 'Submit meter recording failed');
              setLoading(false);
            },
          );
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Error', error);
    }
  };

  return (
    <View style={global_style.sub_page}>
      <Spinner
        visible={loading}
        textContent={'Submiting Activity...'}
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
              <InputForm
                placeholder="date"
                value={full_date}
                editable={false}
              />
            </View>
            <View style={{width: '30%'}}>
              <InputTime
                placeholder="time taken"
                value={timeTaken ? moment(timeTaken).format('HH:mm') : ''}
                editable={false}
                onPress={() => setShowTime(true)}
              />
              {showTime && (
                <DateTimePicker
                  testID="startTimePicker"
                  value={timeTaken}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onChangeTime}
                />
              )}
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
              <View style={{marginTop: 10}} key={user.id}>
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
                  deleted={true}
                  onPress={() => deleteField(user.id)}
                  valOnHand={user.qtyOnHand.toString()}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1, paddingRight: 10}}>
                    <Text
                      style={{
                        fontSize: 12,
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                        color: colorLogo.color3,
                      }}>
                      Prepared By
                    </Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colorLogo.color3,
                        borderRadius: 10,
                        color: colorLogo.color3,
                        marginTop: 5,
                      }}>
                      <Picker
                        style={{marginVertical: -5}}
                        selectedValue={user.preparedBy}
                        onValueChange={val => setPrepared(user.id, val)}>
                        <Picker.Item
                          key={0}
                          label="Select an prepared"
                          value=""
                        />
                        <Picker.Item key={1} label="Tenant" value="E" />
                        <Picker.Item key={2} label="MMP" value="I" />
                      </Picker>
                    </View>
                  </View>
                  <View style={{paddingRight: 10}}>
                    <View>
                      <InputForm
                        editable={true}
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
                      placeholder={'Description'}
                      value={user.description}
                      onChangeText={val => setValueDescription(user.id, val)}
                    />
                  </View>
                )}
              </View>
            ))}

          {showRequest && (
            <TouchableOpacity
              onPress={() => addCustomField()}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Icon
                name="add-circle-outline"
                size={22}
                color={colorLogo.color3}
              />
              <Text style={{fontSize: 16, color: colorLogo.color3}}>
                ADD ITEM
              </Text>
            </TouchableOpacity>
          )}
          <ListItem style={{paddingLeft: 0, marginLeft: 0}} noBorder>
            <CheckBox
              onPress={() => chkbox_check()}
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
          <ActionButton title="Submit" onPress={() => HandleSubmitActivity()} />
        </View>
      </ScrollView>
    </View>
  );
};

export default FormCreate;
