import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  SkeletonFakeList,
  TextLineIndentLight,
  TopHeader,
} from '../../../../component';
import {global_style} from '../../../../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import {colorButton, colorLogo} from '../../../../utils';
import {Body, Left, ListItem} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-picker';

const AdminPreventifListHistoryCheckStandart = ({navigation}) => {
  console.log('list_history_check_standard');
  const dispatch = useDispatch();
  const PreventifReducer = useSelector(state => state.PreventifReducer);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    try {
      var temp = [];
      db.transaction(txn => {
        txn.executeSql(
          'SELECT * FROM pv_checkstandart_tmp WHERE id_checklist = ? AND process = 1',
          [PreventifReducer.check_standart.id],
          (txn, res) => {
            for (let i = 0; i < res.rows.length; ++i) {
              res.rows.item(i)['editable'] = 0;
              temp.push(res.rows.item(i));
              console.log('push successfully');
            }
            setList([...temp]);
          },
          error => {
            console.log('error on select table list_meter ' + error.message);
          },
        );
      });
      setRefresh(false);
      setProcessing(false);
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error);
      setRefresh(false);
      setProcessing(false);
    }
  };

  // const listOption = [
  //   {id: null, label: '-', enabled: true},
  //   {id: 13, label: 'Normal', enabled: true},
  //   {id: 18, label: 'Warning', enabled: true},
  //   {id: 14, label: 'Damage', enabled: true},
  // ];
  // const option = listOption.map(item => {
  //   return (
  //     <Picker.Item
  //       key={item.id}
  //       label={item.label}
  //       value={item.id}
  //       enabled={item.enabled}
  //     />
  //   );
  // });

  const handleUpdateCheckStandart = data => {
    const index = list.findIndex(item => item.id == data.id);
    if (list[index].required == 1 && list[index].status == '') {
      Alert.alert(
        'Attention!',
        'Task point ' + list[index].task_name + ' is required',
      );
      return false;
    }
    if (list[index].image_required == 1 && list[index].images == null) {
      Alert.alert(
        'Attention!',
        'Image task point ' + list[index].task_name + ' has been required',
      );
      return false;
    }

    setProcessing(true);

    db.transaction(txn => {
      txn.executeSql(
        'UPDATE pv_checkstandart_tmp SET images = ?, remark = ?, status = ? WHERE id = ?',
        [
          list[index].images,
          list[index].remark,
          list[index].status,
          list[index].id,
        ],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            console.log('update check standart successfully');
            getData();
          }
        },
        error => {
          console.log(
            'error on select table pv_checkstandart_tmp ' + error.message,
          );
        },
      );
    });
  };

  const setSelected = (id, selected) => {
    setList(state => {
      const _state = [...state];
      const index = _state.findIndex(item => item.id == id);
      _state[index].status = selected;

      return _state;
    });
  };

  const handleSetText = (id, val) => {
    setList(state => {
      const _state = [...state];
      const index = _state.findIndex(item => item.id == id);
      _state[index].remark = val;

      return _state;
    });
  };
  const options = {
    title: 'Take Photo',
    // noData: true,
  };

  const handleTakePhoto = id => {
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('cancel take picture');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else if (response.error) {
        console.log('LaunchCamera Error: ', response.error);
      } else {
        ImageResizer.createResizedImage(response.uri, 800, 600, 'JPEG', 90)
          .then(response => {
            // const source = {uri: response.uri};
            setList(state => {
              const _state = [...state];
              const index = _state.findIndex(item => item.id == id);
              _state[index].images = response.uri;

              return _state;
            });
          })
          .catch(err => {
            console.log(err);
            return Alert.alert(
              'Unable to resize the photo',
              'Please try again!',
            );
          });
      }
    });
  };

  const handleCancelUpdateCheckStandart = data => {
    setList(state => {
      const _state = [...state];
      const index = _state.findIndex(item => item.id == data.id);
      _state[index].editable = 0;

      return _state;
    });
  };
  const handleModifyCheckStandart = data => {
    setList(state => {
      const _state = [...state];
      const index = _state.findIndex(item => item.id == data.id);
      _state[index].editable = 1;

      return _state;
    });
  };

  const renderStatusList = item => {
    let list_option = [];
    if (item.status_option != undefined) {
      list_option.push({id: '', label: '-', enabled: true});
      JSON.parse(item.status_option).map(val => {
        const source = {
          id: val.bms_status_id,
          label: val.status_name,
          enabled: true,
        };
        list_option.push(source);
      });
    }

    // const list_option = [
    //   {id: null, label: '-', enabled: true},
    //   {id: 13, label: 'Normal', enabled: true},
    //   {id: 18, label: 'Warning', enabled: true},
    //   {id: 14, label: 'Damage', enabled: true},
    // ];

    return (
      <Picker
        enabled={item.editable == 0 ? false : true}
        placeholder="Selected status"
        mode="dropdown"
        style={{height: 20}}
        itemStyle={{fontSize: 8}}
        selectedValue={item.status.toString()}
        onValueChange={val => setSelected(item.id, val)}>
        {/* {renderStatusList(item)} */}
        {list_option.map(item => {
          return (
            <Picker.Item key={item.id} label={item.label} value={item.id} />
          );
        })}
      </Picker>
    );
  };

  const renderItem = ({item, index}) => {
    let background_color;
    if (item.required == 0) {
      background_color = colorButton.submit;
    } else {
      background_color = colorButton.cancel;
    }
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar>
        <Left
          style={{
            backgroundColor: background_color,
            height: '100%',
            alignItems: 'center',
            paddingTop: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
          <View>
            <Icon
              active
              name="ios-clipboard-outline"
              style={{fontSize: 18, paddingHorizontal: 5, fontWeight: 'bold'}}
              color="white"
            />
          </View>
        </Left>
        <Body>
          <View style={{flexWrap: 'wrap'}}>
            <TextLineIndentLight label="Point" value={item.task_name} />
            <TextLineIndentLight label="Desc" value={item.task_description} />
            <View
              style={{
                borderWidth: 0.5,
                marginVertical: 5,
                borderColor: background_color,
              }}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  textAlign: 'justify',
                  width: '20%',
                  flexWrap: 'wrap-reverse',
                }}>
                Photo
              </Text>
              <Text
                style={{
                  textAlign: 'justify',
                  width: '1%',
                  flexWrap: 'wrap-reverse',
                }}>
                :
              </Text>
              <View style={{marginLeft: 3, width: '75%'}}>
                <TouchableOpacity
                  style={{justifyContent: 'center'}}
                  disabled={item.editable == 0 ? true : false}
                  onPress={() => handleTakePhoto(item.id)}>
                  <Image
                    source={{uri: item.images}}
                    style={styles.solid_image}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: background_color,
            }}
          />
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  textAlign: 'justify',
                  width: '20%',
                  flexWrap: 'wrap',
                }}>
                <Text>Status</Text>
              </View>
              <Text
                style={{
                  textAlign: 'justify',
                  width: '1%',
                  flexWrap: 'wrap',
                }}>
                :
              </Text>
              <View
                style={{
                  textAlign: 'justify',
                  width: '75%',
                }}>
                {renderStatusList(item)}
              </View>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: background_color,
            }}
          />

          <View>
            <Text
              style={{
                fontSize: 14,
                textTransform: 'capitalize',
                color: colorLogo.color3,
                marginBottom: 5,
              }}>
              Remarks
            </Text>
            <View style={{marginRight: 5}}>
              <TextInput
                editable={item.editable == 0 ? false : true}
                multiline={true}
                value={item.remark}
                onChangeText={val => handleSetText(item.id, val)}
                style={{
                  borderWidth: 1,
                  marginRight: 10,
                  fontSize: 12,
                  textAlignVertical: 'top',
                  borderRadius: 10,
                  padding: 10,
                  borderColor: colorLogo.color5,
                }}
              />
            </View>
          </View>
          {item.editable == 0 && (
            <View>
              <View
                style={{
                  borderWidth: 0.5,
                  marginVertical: 10,
                  borderColor: background_color,
                }}
              />

              <TouchableOpacity
                style={{
                  marginRight: 15,
                  marginTop: 5,
                  borderRadius: 10,
                  alignItems: 'center',
                  paddingVertical: 5,
                  backgroundColor: colorButton.primary,
                }}
                onPress={() => handleModifyCheckStandart(item)}>
                <Text style={{color: 'white'}}>Modify</Text>
              </TouchableOpacity>
            </View>
          )}
          {item.editable == 1 && (
            <View>
              <View
                style={{
                  borderWidth: 0.5,
                  marginVertical: 10,
                  borderColor: background_color,
                }}
              />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  style={{
                    width: '45%',
                    marginRight: 15,
                    marginTop: 5,
                    borderRadius: 10,
                    alignItems: 'center',
                    paddingVertical: 5,
                    backgroundColor: colorButton.primary,
                  }}
                  onPress={() => handleUpdateCheckStandart(item)}>
                  <Text style={{color: 'white'}}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '45%',
                    marginRight: 15,
                    marginTop: 5,
                    borderRadius: 10,
                    alignItems: 'center',
                    paddingVertical: 5,
                    backgroundColor: colorButton.cancel,
                  }}
                  onPress={() => handleCancelUpdateCheckStandart(item)}>
                  <Text style={{color: 'white'}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Body>
      </ListItem>
    );
  };

  const onRefresh = () => {
    setRefresh(true);
    getData();
  };

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const renderEmpty = () => {
    if (loading == true) {
      return <SkeletonFakeList row={8} height={110} />;
    } else {
      return (
        <View style={global_style.container_empty}>
          <Text style={global_style.text_empty}>NO DATA HISTORY</Text>
        </View>
      );
    }
  };

  return (
    <View style={global_style.page}>
      <TopHeader
        title="Preventive"
        subTitle="Listing Preventive"
        onPress={() => navigation.navigate('AdminPreventifListChecklist')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />

      <View style={global_style.sub_page}>
        <View style={global_style.content}>
          <View>
            <Spinner
              visible={processing}
              textContent={'Processing...'}
              textStyle={{color: '#FFF'}}
              overlayColor={'rgba(0, 0, 0, 0.60)'}
            />
            <FlatList
              data={list}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={renderEmpty()}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  blur_image: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
    opacity: 0.2,
    marginBottom: 30,
    borderColor: colorLogo.color4,
    borderRadius: 10,
  },
  solid_image: {
    width: 170,
    height: 230,
    resizeMode: 'contain',
    borderColor: colorLogo.color4,
  },
};
export default AdminPreventifListHistoryCheckStandart;
