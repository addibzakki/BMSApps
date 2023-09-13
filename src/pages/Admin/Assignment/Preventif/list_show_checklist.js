import React, {useEffect, useState} from 'react';
import {View, Alert, Text, FlatList, RefreshControl, TouchableOpacity, Modal, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  SkeletonFakeList,
  TextLineIndentLight,
  TopHeader,
} from '../../../../component';
import Icon from 'react-native-vector-icons/Ionicons';
import {global_style} from '../../../../styles';
import {Body, Left, ListItem} from 'native-base';
import {setPVCheckStandartID} from '../../../../redux';
import {PreventiveAPIService} from '../../../../services';
import { colorButton, colorLogo } from '../../../../utils';
import Spinner from 'react-native-loading-spinner-overlay';

const AdminPreventifListShowChecklist = ({navigation}) => {
  console.log('In Page List Show Checklist Preventif');

  const dispatch = useDispatch();
  const PreventifReducer = useSelector(state => state.PreventifReducer);
  const [list, setList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState(null);
  const [id, setId] = useState(null);

  const handleConfirm = id => {
    Alert.alert(
      'Attention!',
      'Are you sure want to approve this submit preventive?',
      [
        {
          text: 'No',
          onPress: () => console.log('No'),
        },
        {
          text: 'Yes, Sure!',
          onPress: () => handleApprove(id),
        },
      ],
    );
  };

  const handleApprove = async id => {
    try {
      setProcessing(true);
      const res = await PreventiveAPIService.approveSubmitPreventive({
        trans_code: id,
      });
      if (res.data.error === false) {
        Alert.alert('Success', 'This preventive has been approve', [
          {
            text: 'Ok',
            onPress: () => {
              setProcessing(false);
              navigation.replace('AdminSPVPreventifApproval');
            },
          },
        ]);
      } else {
        console.log(res.data.code);
        if (res.data.code === 422) {
          Alert.alert('Error ' + res.data.code, res.data.message[0]);
        } else {
          Alert.alert('Error ' + res.data.code, res.data.message);
        }
        setProcessing(false);
      }
    } catch (error) {
      console.log(error);
      setProcessing(false);
      Alert.alert('Error', error);
    }
  };

  const handleConfirmReject = id => {
    setId(id);
    setModalVisible(!modalVisible);
  };

  const ConfirmReject = () => {
    if (note === null) {
      Alert.alert('Error', 'Remark must be filled');
    } else {
      Alert.alert(
        'Attention!',
        'Are you sure want to reject this submit preventif maintenance?',
        [
          {
            text: 'No',
            onPress: () => console.log('No'),
          },
          {
            text: 'Yes, Sure!',
            onPress: () => handleReject(),
          },
        ],
      );
    }
  };

  const handleReject = async () => {
    try {
      setProcessing(true);
      const params = {
        trans_code: id,
        remark: note,
      };
      const res = await PreventiveAPIService.rejectSubmitPreventive(params);
      if (res.data.error === false) {
        Alert.alert('Success', 'Process reject successfully', [
          {
            text: 'Ok',
            onPress: () => {
              setProcessing(false);
              setModalVisible(!modalVisible);
              navigation.replace('AdminSPVPreventifApproval');
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Error on Process Reject Code : ' + res.data.code);
        setProcessing(false);
      }
    } catch (error) {
      console.log(error);
      setProcessing(false);
      Alert.alert('Error', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const getData = async () => {
    try {
      const res = await PreventiveAPIService.getAllChecklist(
        PreventifReducer['checklist_id'],
      );
      console.log(res.data.data);
      setList([...res.data.data]);
      setLoading(false);
      setRefresh(false);
    } catch (error) {
      dispatch(setRefresh(false));
      Alert.alert('Error', error.message);
      setLoading(false);
      setRefresh(false);
    }
  };

  const handleGoTo = async id => {
    dispatch(setPVCheckStandartID(id));
    navigation.navigate('AdminPreventifListShowCheckStandart');
  };

  const renderItem = ({item, index}) => {
    let background_color = item.bms_status.status_color.replace(/\s/g, '');
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar
        onPress={() => handleGoTo(item.id)}>
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
          <TextLineIndentLight label="Name" value={item.task_group.name} />
          <TextLineIndentLight
            label="Desc"
            value={item.task_group.description}
          />
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: item.bms_status.status_color,
            }}
          />
          <TextLineIndentLight
            label="Status"
            value={
              item.bms_status.status_name === 'New'
                ? '-'
                : item.bms_status.status_name
            }
          />
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
    if (loading === true) {
      return <SkeletonFakeList row={8} height={110} />;
    } else {
      return (
        <View style={global_style.container_empty}>
          <Text style={global_style.text_empty}>NO LISTING CHECKLIST</Text>
        </View>
      );
    }
  };

  return (
    <View style={global_style.page}>
      <TopHeader
        title="Show Preventive"
        subTitle={'#' + PreventifReducer['trans_code']}
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <Spinner
        visible={processing}
        textContent={'Processing...'}
        textStyle={{ color: '#FFF' }}
        overlayColor={'rgba(0, 0, 0, 0.60)'}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
          }}>
          <View
            style={{
              flex: 1,
              width: '100%',
              marginTop: 86,
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
            <Text style={{ fontWeight: 'bold' }}>REMARK</Text>
            <TextInput
              multiline={true}
              value={note}
              onChangeText={val => setNote(val)}
              style={{
                width: '100%',
                height: '50%',
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
                  ConfirmReject();
                }}>
                <Text style={{ color: 'white' }}>Submit</Text>
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
                }}>
                <Text style={{ color: 'white' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={global_style.sub_page}>
        <View style={[global_style.content, {flex: 1}]}>
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <TouchableOpacity
              style={{
                width: '30%',
                alignItems: 'center',
                padding: 5,
                borderRadius: 10,
                backgroundColor: colorButton.submit,
              }}
              onPress={() => handleConfirm(PreventifReducer['trans_code'])}
              >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>
                <Icon name="md-checkmark-sharp" color="white" size={18} />
                Approve
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: '30%',
                alignItems: 'center',
                padding: 5,
                borderRadius: 10,
                backgroundColor: colorButton.cancel,
              }}
              onPress={() => handleConfirmReject(PreventifReducer['trans_code'])}
              >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>
                <Icon name="md-close-sharp" color="white" size={18} />
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdminPreventifListShowChecklist;
