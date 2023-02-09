import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  Keyboard,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  ModalShowImage,
  sendNotificationOneSignal,
  SkeletonFakeList,
  TextLineIndentLight,
  TopHeader,
} from '../../../../component';
import {global_style} from '../../../../styles';
import {Body, Button, Footer, FooterTab, Left, ListItem} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import {colorLogo} from '../../../../utils';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import {PreventiveAPIService} from '../../../../services';
import {setPVCheckStandartAttr} from '../../../../redux';

const AdminPreventifListChecklist = ({navigation}) => {
  console.log('Halaman cheklist assignmnet');

  const dispatch = useDispatch();
  const PreventifReducer = useSelector(state => state.PreventifReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState(null);
  const [data, setData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [picture, setPicture] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [loadingProcess, setLoadingProcess] = useState(false);
  const [titleProcess, setTitleProcess] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [totalData, setTotalData] = useState(0);

  const HandleModalVisible = (value, file) => {
    setModalOpen(value);
    setModalImage(file.url);
  };

  useEffect(() => {
    if (refresh == true) {
      getCollection();
    }
    const unsubscribe = navigation.addListener('focus', () => {
      getCollection();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation, refresh == true]);

  const getCollection = async () => {
    changeModal(true, 'Preparing data, please wait');
    try {
      let dataSubmit = [];
      var temp = [];
      db.transaction(txn => {
        txn.executeSql(
          'SELECT * FROM pv_checklist_tmp where transaksi_preventive_maintenance_id = ?',
          [PreventifReducer.checklist.id],
          (txn, res) => {
            let count = 0;
            for (let i = 0; i < res.rows.length; ++i) {
              let uploadData = new FormData();
              uploadData.append(
                'check_lists[' + i + '][id]',
                res.rows.item(i)['id'],
              );
              uploadData.append('check_lists[' + i + '][remark]', '');
              uploadData.append(
                'check_lists[' + i + '][status]',
                res.rows.item(i)['status_id'],
              );
              dataSubmit[i] = uploadData;
              setData(dataSubmit);

              txn.executeSql(
                'SELECT * FROM pv_checkstandart_tmp where id_checklist = ?',
                [res.rows.item(i)['id']],
                (txn, rest) => {
                  for (let x = 0; x < rest.rows.length; ++x) {
                    uploadData.append(
                      'check_lists[' + i + '][details][' + x + '][id]',
                      rest.rows.item(x)['id'],
                    );
                    uploadData.append(
                      'check_lists[' +
                        i +
                        '][details][' +
                        x +
                        '][task_detail_id]',
                      rest.rows.item(x)['task_id'],
                    );
                    if (rest.rows.item(x)['status'] != null) {
                      uploadData.append(
                        'check_lists[' + i + '][details][' + x + '][status]',
                        rest.rows.item(x)['status'],
                      );
                    }
                    uploadData.append(
                      'check_lists[' + i + '][details][' + x + '][remark]',
                      rest.rows.item(x)['remark'] == 'undefined'
                        ? ''
                        : rest.rows.item(x)['remark'],
                    );
                    if (rest.rows.item(x)['images'] != null) {
                      if (rest.rows.item(x)['images'] != '') {
                        uploadData.append(
                          'check_lists[' + i + '][details][' + x + '][image]',
                          {
                            type: 'image/jpeg',
                            uri: rest.rows.item(x)['images'],
                            name: rest.rows
                              .item(x)
                              ['images'].substring(
                                rest.rows.item(x)['images'].lastIndexOf('/') +
                                  1,
                              ),
                          },
                        );
                      }
                    }
                    dataSubmit[i] = uploadData;
                    setData(dataSubmit);
                  }
                },
                error => {
                  console.log(
                    'error on select table pv_checkstandart_tmp ' +
                      error.message,
                  );
                },
              );
              temp.push(res.rows.item(i));
              console.log('push to temp variable successfully');
            }
            setList([...temp]);
            console.log('table pv_checklist_tmp : ' + temp.length);
            setRefresh(false);
            setLoading(false);
            changeModal(false);
          },
          error => {
            console.log(
              'error on select table pv_checklist_tmp ' + error.message,
            );
            changeModal(false);
          },
        );
      });
    } catch (error) {
      setRefresh(false);
      setLoading(false);
      changeModal(false);
      Alert.alert('Error', error.message);
    }
  };

  const changeModal = (set, title = '') => {
    setLoadingProcess(set);
    setTitleProcess(title);
  };

  const handleConfirm = () => {
    if (note == null || note == '') {
      Alert.alert('Error', 'Please take remark before submit to corrective');
    } else if (fileList.length < 1) {
      Alert.alert(
        'Error',
        'Please take at least 1 picture before submit to corrective',
      );
    } else {
      Alert.alert(
        'Attention!',
        'Are you sure to change this preventif maintenance to corrective maintenance?',
        [
          {text: 'No', onPress: () => console.log('No')},
          {
            text: 'Yes, Sure!',
            onPress: () => handleToCorrective(),
          },
        ],
      );
    }
  };

  const handleToCorrective = async () => {
    changeModal(true, 'Submit to corrective');
    try {
      let uploadData = new FormData();
      picture.map(resources => {
        uploadData.append('images[]', {
          type: 'image/jpeg',
          uri: resources.uri,
          name: resources.uri.substring(resources.uri.lastIndexOf('/') + 1),
        });
      });
      uploadData.append('status', 16);
      uploadData.append('remark', note);

      const params = [PreventifReducer.checklist.id, uploadData];
      const res = await PreventiveAPIService.submitToCorrectiveFromPreventif(
        params,
      );
      if (res.data.code == 200) {
        Alert.alert(
          'Success!',
          'This preventive wait to confirm transfer corrective',
          [
            {
              text: 'Ok',
              onPress: () => {
                setModalVisible(false);
                changeModal(false, 'Submit to corrective');
                setRefresh(true);
                if (LoginReducer.form.profile.level == 'Supervisor') {
                  navigation.navigate('AdminSPVPreventifDashboard');
                } else {
                  navigation.navigate('AdminPICPreventifDashboard');
                }
              },
            },
          ],
        );
      } else {
        Alert.alert('Error!', 'Sorry, Error data or duplicate process');
        changeModal(false);
      }
    } catch (error) {
      setModalVisible(false);
      changeModal(false);
      console.log(error);
      Alert.alert('Error', error);
    }
  };

  const handleConfirmSubmit = () => {
    Alert.alert('Attention!', 'Are you sure want to submit this preventive?', [
      {text: 'No', onPress: () => console.log('Reject')},
      {text: 'Yes, Sure!', onPress: () => handleSubmit()},
    ]);
  };

  const removeFromTmp = () => {
    db.transaction(txn => {
      txn.executeSql(
        'DELETE FROM pv_checklist_tmp WHERE transaksi_preventive_maintenance_id = ?',
        [PreventifReducer.checklist.id],
        (txn, res) => {
          console.log('delete pv_checklist_tmp successfully');
        },
        error => {
          console.log('error on delete item : ' + error.message);
        },
      );
      txn.executeSql(
        'DELETE FROM pv_checkstandart_tmp WHERE transaksi_preventive_maintenance_id = ?',
        [PreventifReducer.checklist.id],
        (txn, res) => {
          console.log('delete pv_checkstandart_tmp successfully');
        },
        error => {
          console.log('error on delete item : ' + error.message);
        },
      );
    });
  };

  const procesSubmit = async () => {
    var count = 0;
    data.map(async val => {
      try {
        const params = [PreventifReducer.checklist.id, val];
        console.log(params);
        const res = await PreventiveAPIService.submitPartialPreventif(params);
        console.log(res.data);
        if (res.data.error == false) {
          count++;
          console.log(count, data.length);
          if (count == data.length) {
            try {
              const res_final = await PreventiveAPIService.submitToChangeAndSumStatus(
                PreventifReducer.checklist.id,
              );
              if (res_final.data.error == false) {
                Alert.alert(
                  'Success!',
                  'This preventif has ben successfully submit and wait confirm SPV',
                  [
                    {
                      text: 'Ok',
                      onPress: () => {
                        changeModal(false);
                        setRefresh(true);
                        removeFromTmp();
                        sendNotificationOneSignal(
                          res_final.data.data.subtitle,
                          res_final.data.data.activity,
                          res_final.data.data.player_ids,
                        );
                        if (LoginReducer.form.profile.level == 'Supervisor') {
                          navigation.navigate('AdminSPVPreventifDashboard');
                        } else {
                          navigation.navigate('AdminPICPreventifDashboard');
                        }
                      },
                    },
                  ],
                );
              } else {
                if (res_final.data.code == 422) {
                  Alert.alert(
                    'Error ' + res.data.code + '!',
                    res.data.message[0],
                  );
                } else {
                  Alert.alert('Error ' + res.data.code + '!', res.data.message);
                }
              }
            } catch (error) {
              Alert.alert('error catch', error.message);
              console.log(error);
              changeModal(false);
            }
          }
        } else {
          if (res.data.code == 422) {
            Alert.alert('Error ' + res.data.code + '!', res.data.message[0]);
          } else {
            Alert.alert('Error ' + res.data.code + '!', res.data.message);
          }
          changeModal(false);
          return false;
        }
      } catch (error) {
        Alert.alert('error catch', error.message);
        console.log(error);
        changeModal(false);
      }
    });
  };

  const handleSubmit = async () => {
    changeModal(true, 'Submit Preventive');
    try {
      db.transaction(txn => {
        txn.executeSql(
          'SELECT * FROM pv_checklist_tmp where transaksi_preventive_maintenance_id = ?',
          [PreventifReducer.checklist.id],
          (txn, res) => {
            for (let i = 0; i < res.rows.length; ++i) {
              if (res.rows.item(i)['status_id'] != 6) {
                Alert.alert(
                  'Attention!',
                  "Sorry, you haven't finished all the task groups",
                );
                return false;
              }
            }
            procesSubmit();
          },
          error => {
            console.log(
              'error on select table pv_checklist_tmp ' + error.message,
            );
            return false;
          },
        );
      });
    } catch (error) {
      console.log(error.message);
      changeModal(false);
    }
  };

  const handlePhotoToCorrective = () => {
    if (fileList.length == 3) {
      Alert.alert(
        'Error',
        'Sorry, to capture photos a maximum of only 3 times',
      );
    } else {
      ImagePicker.launchCamera(
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
            onSelectedImage(response);
          }
        },
      );
    }
  };

  const onSelectedImage = image => {
    let newDataImg = fileList;
    const source = {uri: image.uri};
    let item = {
      url: source,
      uri: image.uri,
      type: image.type,
      fileName: image.fileName,
    };
    newDataImg.push(item);
    setFileList(newDataImg);
    setPicture(picture.concat(image));
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          height: 100,
          width: 100,
          marginRight: 10,
          marginVertical: 5,
        }}>
        <TouchableWithoutFeedback
          onPress={() => HandleModalVisible(true, item)}>
          <Image
            source={item.url}
            style={{
              height: 100,
              width: 100,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
            resizeMethod="resize"
          />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const handleGoTo = async item => {
    dispatch(setPVCheckStandartAttr(item));
    navigation.navigate('PreventiveCheckStandart');
  };

  const renderListItem = ({item, index}) => {
    let background_color = item.status_color.replace(/\s/g, '');
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
          <TextLineIndentLight label="Name" value={item.name} />
          <TextLineIndentLight label="Desc" value={item.description} />
          <TextLineIndentLight
            label="Total"
            value={item.total_check_standard}
          />
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: item.status_color,
            }}
          />
          <TextLineIndentLight
            label="Status"
            value={item.status_name == 'New' ? '-' : item.status_name}
          />
        </Body>
      </ListItem>
    );
  };

  const onRefresh = () => {
    setRefresh(true);
  };

  const renderEmpty = () => {
    return (
      <View style={global_style.container_empty}>
        <Text style={global_style.text_empty}>NO LISTING CHECKLIST</Text>
      </View>
    );
  };

  const content = () => {
    if (loading == true) {
      return <SkeletonFakeList row={8} height={110} />;
    } else {
      return (
        <View>
          <FlatList
            data={list}
            renderItem={renderListItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={renderEmpty()}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
          />
        </View>
      );
    }
  };

  return (
    <View style={global_style.page}>
      <Spinner
        visible={loadingProcess}
        textContent={titleProcess}
        textStyle={{color: '#FFF'}}
        overlayColor={'rgba(0, 0, 0, 0.60)'}
      />
      <ModalShowImage
        imageURL={modalImage}
        visible={modalOpen}
        setVisible={() => setModalOpen(false)}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
          }}>
          <View
            enabled
            style={{
              flex: 1,
              width: '100%',
              marginTop: 86,
              backgroundColor: 'white',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              // padding: 20,
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
            <Text style={{fontWeight: 'bold'}}>REMARK</Text>

            <TextInput
              multiline={true}
              value={note}
              onChangeText={val => setNote(val)}
              style={{
                width: '100%',
                height: '30%',
                borderWidth: 1,
                marginTop: 10,
                fontSize: 12,
                textAlignVertical: 'top',
                borderRadius: 10,
                padding: 10,
                borderColor: colorLogo.color5,
              }}
            />
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}>
              <Text style={{fontWeight: 'bold'}}>PHOTO</Text>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colorLogo.color2,
                  padding: 5,
                  borderRadius: 10,
                }}
                onPress={() => {
                  handlePhotoToCorrective();
                  Keyboard.dismiss;
                }}>
                <Text style={{color: 'white'}}>
                  <Icon active name="camera-sharp" color="white" size={16} />{' '}
                  Take Photo
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
              }}>
              <FlatList
                horizontal
                data={fileList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              />
            </ScrollView>

            <View
              style={{
                position: 'absolute',
                bottom: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colorLogo.color2,
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10,
                  marginHorizontal: 5,
                }}
                onPress={() => {
                  handleConfirm();
                }}>
                <Text style={{color: 'white'}}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colorLogo.color1,
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10,
                  marginHorizontal: 5,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setFileList([]);
                }}>
                <Text style={{color: 'white'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <TopHeader
        title="Checklist Preventive"
        subTitle={'#' + PreventifReducer.checklist.trans_code}
        onPress={() => {
          if (LoginReducer.form.profile.level == 'Supervisor') {
            navigation.navigate('AdminPreventif');
          } else {
            navigation.navigate('AdminPICPreventifDashboard');
          }
        }}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <View style={[global_style.content, {flex: 1}]}>{content()}</View>
        <Footer>
          <FooterTab>
            <Button
              success
              full
              onPress={() => handleConfirmSubmit()}
              style={{borderRightColor: '#ccc', borderRightWidth: 1}}>
              <Text
                style={{
                  color: '#FFF',
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Submit
              </Text>
            </Button>
            <Button
              warning
              full
              onPress={() => setModalVisible(true)}
              style={{borderRightColor: '#ccc', borderRightWidth: 1}}>
              <Text
                style={{
                  color: '#FFF',
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                To Corrective
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    </View>
  );
};

export default AdminPreventifListChecklist;
