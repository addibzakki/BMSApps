import React, {useContext, useState} from 'react';
import {
  Text,
  Alert,
  Modal,
  Pressable,
  View,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'native-base';
import GlobalContext from '../../../GlobalContext';
import {colorButton} from '../../../../utils';
import {CorrectiveAPIService} from '../../../../services';
import {useSelector} from 'react-redux';
import {sendNotificationOneSignal} from '../../../notification/index';
import {RFPercentage} from 'react-native-responsive-fontsize';

export const ButtonConfirmJobDone = props => {
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const GlobalState = useContext(GlobalContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleJobDone = async chargeable => {
    setModalVisible(false);
    try {
      GlobalState.setLoadingSubmit(true);
      const params = {
        type: 'action-taken',
        ticket_no: CorrectiveReducer.ticket_no,
        eng_username: LoginReducer.form.profile.uid,
        eng_level: LoginReducer.form.profile.level,
        status: 5,
        chargeable: chargeable,
      };
      const res = await CorrectiveAPIService.submitUpdateStatusCorrective(
        params,
      );
      if (res.data.message == 'success') {
        GlobalState.setLoadingSubmit(false);
        sendNotificationOneSignal(
          res.data.notification.subtitle,
          res.data.notification.activity,
          res.data.notification.player_ids,
        );
        props.navigation.replace('AdminHelpdeskDashboard');
      } else {
        GlobalState.setLoadingSubmit(false);
        Alert.alert(
          'Error',
          'Something wrong with status : ' + res.data.message,
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error);
    }
  };

  const confirmJobDone = status => {
    let message;
    if (status == 'Y') {
      message = 'Are you to confirm this ticket has complete and chargeable?';
    } else {
      message =
        'Are you to confirm this ticket has complete and non chargeable?';
    }
    Alert.alert('Confirmation!', message, [
      {
        text: 'No',
        onPress: () => console.log('cancel'),
        style: 'cancel',
      },
      {
        text: 'Yes, Sure!',
        onPress: () => {
          handleJobDone(status);
        },
      },
    ]);
  };

  return (
    <View style={{flex: 1}}>
      <Modal
        animationType="fade"
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
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
          }}>
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              // padding: 20,
              paddingHorizontal: 20,
              paddingTop: 30,
              paddingBottom: 10,
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
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                width: 20,
                height: 20,
                borderRadius: 50,
                alignItems: 'center',
                backgroundColor: colorButton.cancel,
              }}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={{fontWeight: 'bold'}}>x</Text>
            </TouchableOpacity>
            <Text
              style={{
                marginBottom: 15,
                textAlign: 'center',
              }}>
              Are this ticket chargeable?
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Pressable
                style={[
                  {
                    borderRadius: 20,
                    padding: 10,
                    elevation: 2,
                    flex: 1,
                  },
                  {
                    backgroundColor: colorButton.submit,
                  },
                ]}
                onPress={() => confirmJobDone('Y')}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Yes
                </Text>
              </Pressable>
              <Pressable
                style={[
                  {
                    borderRadius: 20,
                    padding: 10,
                    elevation: 2,
                    flex: 1,
                  },
                  {
                    backgroundColor: colorButton.cancel,
                  },
                ]}
                onPress={() => confirmJobDone('N')}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  No
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Button primay full onPress={() => setModalVisible(!modalVisible)}>
        <Text
          style={{
            color: '#FFF',
            fontSize: RFPercentage(2),
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Confirm Job Done
        </Text>
      </Button>
    </View>
  );
};
