import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {ListItem, Left, Body} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextLineIndentLight} from '../../atoms/Text/index';
import {colorButton, colorLogo} from '../../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {setRefresh} from '../../../redux';
import {SkeletonFakeList} from '../../layouts/skeleton/index';
import {global_style} from '../../../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import {ModalShowImage} from '../../atoms/Modal/index';
import {PreventiveAPIService} from '../../../services';

export const ListConfirmationPreventiveToCorrective = (props, ...rest) => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const HandleModalVisible = (value, file) => {
    console.log(file.path);
    setModalOpen(value);
    setModalImage({uri: file.path});
  };

  const handleConfirm = item => {
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
          onPress: () => handleApprove(item),
        },
      ],
    );
  };

  const removeFromTmp = transaksi_preventive_maintenance_id => {
    db.transaction(txn => {
      txn.executeSql(
        'DELETE FROM pv_checklist_tmp WHERE transaksi_preventive_maintenance_id = ?',
        [transaksi_preventive_maintenance_id],
        (txn, res) => {
          console.log('delete pv_checklist_tmp successfully');
        },
        error => {
          console.log('error on delete item : ' + error.message);
        },
      );
      txn.executeSql(
        'DELETE FROM pv_checkstandart_tmp WHERE transaksi_preventive_maintenance_id = ?',
        [transaksi_preventive_maintenance_id],
        (txn, res) => {
          console.log('delete pv_checkstandart_tmp successfully');
        },
        error => {
          console.log('error on delete item : ' + error.message);
        },
      );
    });
  };

  const handleApprove = async item => {
    try {
      setProcessing(true);
      const res = await PreventiveAPIService.submitApprovePreventifToCorrective(
        item.id,
      );
      if (res.data.code === 200) {
        Alert.alert('Success', 'This submit preventive has been approve', [
          {
            text: 'Ok',
            onPress: () => {
              removeFromTmp(item.asset_detail.id);
              dispatch(setRefresh(true));
              setProcessing(false);
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Error on Process Approve!');
        setProcessing(false);
      }
    } catch (error) {
      console.log(error);
      setProcessing(false);
      Alert.alert('Error', error);
    }
  };

  const handleConfirmReject = id => {
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
          onPress: () => handleReject(id),
        },
      ],
    );
  };

  const handleReject = async id => {
    try {
      setProcessing(true);
      const res = await PreventiveAPIService.submitRejectPreventifToCorrective(
        id,
      );
      if (res.data.code === 200) {
        Alert.alert(
          'Success',
          'Process reject submit preventive successfully',
          [
            {
              text: 'Ok',
              onPress: () => {
                dispatch(setRefresh(true));
                setProcessing(false);
              },
            },
          ],
        );
      } else {
        Alert.alert('Error', 'Error on Process Reject');
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
            <Text style={{fontWeight: 'bold'}}>
              {'#' + item.preventive_code}
            </Text>
            {/* <TouchableOpacity onPress={() => handleGoTo(item)}>
              <Text>Show Detail</Text>
            </TouchableOpacity> */}
          </View>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 10,
              borderColor: item.status_color,
            }}
          />
          <TextLineIndentLight label="Type" value={item.asset.type} />
          <TextLineIndentLight label="Location" value={item.location['name']} />
          <TextLineIndentLight label="Remark" value={item.remark} />
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 10,
              borderColor: item.status_color,
            }}
          />
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
            }}>
            {item.images.map(image => (
              <View
                style={{
                  height: 100,
                  width: 100,
                  marginRight: 10,
                  marginVertical: 5,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => HandleModalVisible(true, image)}>
                  <Image
                    source={{uri: image.path}}
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
            ))}
          </ScrollView>

          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 10,
              borderColor: item.status_color,
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
              onPress={() => handleConfirm(item)}>
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
              onPress={() => handleConfirmReject(item.id)}>
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
      <ModalShowImage
        imageURL={modalImage}
        visible={modalOpen}
        setVisible={() => setModalOpen(false)}
      />
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
