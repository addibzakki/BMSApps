import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {ListItem, Left, Body} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextLineIndentLight} from '../../atoms/Text/index';
import {colorButton, colorLogo} from '../../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {setPVChecklistID, setPVTransCode, setRefresh} from '../../../redux';
import {SkeletonFakeList} from '../../layouts/skeleton/index';
import {global_style} from '../../../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import {PreventiveAPIService} from '../../../services';

export const ListConfirmationPreventiveSubmit = (props, ...rest) => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState(null);
  const [id, setId] = useState(null);

  const goTo = item => {
    dispatch(setPVChecklistID(item.id));
    dispatch(setPVTransCode(item.trans_code));
    props.navigation.navigate('AdminPreventifListShowChecklist');
  };

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
              dispatch(setRefresh(true));
              setProcessing(false);
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
              dispatch(setRefresh(true));
              setProcessing(false);
              setModalVisible(!modalVisible);
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

  const onRefresh = () => {
    dispatch(setRefresh(true));
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
          <Text style={global_style.text_empty}>NO LISTING</Text>
        </View>
      );
    }
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
        avatar>
        <Left
          style={{
            backgroundColor: colorLogo.color4,
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: 10,
            }}>
            <Text style={{fontWeight: 'bold'}}>{'#' + item.trans_code}</Text>
            <TouchableOpacity onPress={() => goTo(item)}>
              <Text>Show Detail</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 10,
              borderColor: colorLogo.color1,
            }}
          />
          <TextLineIndentLight label="Assigned" value={item.assign_to} />
          <TextLineIndentLight
            label="Asset"
            value={item.asset_detail.asset_name}
          />
          <TextLineIndentLight label="Type" value={item.asset.type} />
          <TextLineIndentLight label="Brand" value={item.asset.brand} />
          <TextLineIndentLight label="Location" value={item.location.name} />
          <TextLineIndentLight label="Schedule" value={item.schedule_date} />
          <TextLineIndentLight
            label="Barcode"
            value={item.asset_detail.barcode}
          />
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 10,
              borderColor: colorLogo.color1,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: 10,
            }}>
            <TouchableOpacity
              style={{
                width: '30%',
                alignItems: 'center',
                padding: 5,
                borderRadius: 10,
                backgroundColor: colorButton.submit,
              }}
              onPress={() => handleConfirm(item.trans_code)}>
              <Text style={{fontWeight: 'bold', color: 'white'}}>
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
              onPress={() => handleConfirmReject(item.trans_code)}>
              <Text style={{fontWeight: 'bold', color: 'white'}}>
                <Icon name="md-close-sharp" color="white" size={18} />
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        </Body>
      </ListItem>
    );
  };
  return (
    <View>
      <Spinner
        visible={processing}
        textContent={'Processing...'}
        textStyle={{color: '#FFF'}}
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
            <Text style={{fontWeight: 'bold'}}>REMARK</Text>
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
                }}>
                <Text style={{color: 'white'}}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={props.list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmpty()}
        refreshControl={
          <RefreshControl
            refreshing={GlobalReducer.refresh}
            onRefresh={() => onRefresh()}
          />
        }
        {...rest}
      />
    </View>
  );
};
