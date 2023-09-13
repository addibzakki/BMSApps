import React, {useContext, useState} from 'react';
import {Text, Alert, View, Modal, ScrollView, BackHandler, KeyboardAvoidingView} from 'react-native';
import {Button} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import {setLoading} from '../../../../redux';
import {CorrectiveAPIService} from '../../../../services';
import {RFPercentage} from 'react-native-responsive-fontsize';
import BackgroundJob from 'react-native-background-job';
import {store_cm_tenant_ticket_done} from '../../../databases/store/store_cm_tenant_ticket_done_tmp';
import GlobalContext from '../../../GlobalContext';
import {sendNotificationOneSignal} from '../../../notification/index';
import { TextLineIndentLight } from '../../Text';
import { colorLogo } from '../../../../utils';
import { ActionButtonHalf } from '../../../../pages/Dashboard/ActionButton';
import { InputForm } from '../../Input';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';

export const ButtonTransfer = props => {
  const dispatch = useDispatch();
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const networkContext = useContext(GlobalContext);
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState('');

  BackgroundJob.register({
    jobKey: 'wait_sending_ticket_done',
    job: () => {
      const params = {
        type: 'action-taken',
        ticket_no: CorrectiveReducer.ticket_no,
        eng_username: LoginReducer.form.profile.uid,
        eng_level: LoginReducer.form.profile.level,
        status: 4,
      };
      store_cm_tenant_ticket_done(db, params);
      console.log('Background Job fired for : All job pending');
    },
  });

  const handleTransferTicket = async () => {
    try {
      dispatch(setLoading(true));
      const params = {
        type: 'transfer-ticket',
        ticket_no: CorrectiveReducer.ticket_no,
        eng_username: LoginReducer.form.profile.uid,
        eng_level: LoginReducer.form.profile.level,
        status: 24,
        remark: result,
      };
      console.log(params);
      const res = await CorrectiveAPIService.submitUpdateStatusCorrective(
        params,
      );
      if (res.data.message == 'success') {
        dispatch(setLoading(false));
        sendNotificationOneSignal(
          res.data.notification.subtitle,
          res.data.notification.activity,
          res.data.notification.player_ids,
        );
        setVisible(false);
        props.navigation.replace('AdminHelpdeskDashboard');
      } else {
        dispatch(setLoading(false));
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

  const confirmSubmit = () => {
    if (result == '') {
      Alert.alert('Required', 'Note field has required');
    } else {
      Alert.alert('Confirmation!', 'Do you want transfer this ticket to team project development?', [
        {
          text: 'No',
          onPress: () => console.log('cancel'),
          style: 'cancel',
        },
        {text: 'Yes, Sure!', onPress: () => handleTransferTicket()},
      ]);
    }
  }


  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={visible}
        onRequestClose={() => BackHandler.exitApp()}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            backgroundColor: colorLogo.color2,
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <KeyboardAvoidingView enabled>
            <View
              style={{
                paddingHorizontal: 20,
                alignItems: 'center',
              }}>
              <Icon active name="clipboard-outline" size={90} color="black" />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 24,
                  color: 'black',
                }}>
                Please give note, why you transfer this ticket?
              </Text>
            </View>
            <View style={styles.space(20)} />
            <View
              style={{
                paddingHorizontal: 20,
              }}>
              <InputForm
                style={{
                  borderWidth: 1,
                  borderColor: colorLogo.color3,
                  borderRadius: 10,
                  padding: 10,
                  fontSize: 14,
                  color: colorLogo.color3,
                  backgroundColor: 'white',
                  textAlignVertical: 'top',
                  height: 200,
                }}
                multiline={true}
                value={result}
                onChangeText={value => setResult(value)}
              />
            </View>
            <View style={styles.space(20)} />
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                justifyContent: 'space-between',
              }}>
              <ActionButtonHalf
                title="Cancel"
                onPress={() => {
                  setVisible(false);
                  setResult('');
                }}
                style={{
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: colorLogo.color1,
                }}
              />
              <ActionButtonHalf
                title="Submit"
                onPress={() => confirmSubmit()}
                style={{
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: colorLogo.color3,
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </Modal>
    <Button
      warning
      full
      onPress={() => {
        if (networkContext.networkInfo == false) {
          Alert.alert(
            'Attention',
            'Sorry, please use a good network to access this feature',
          );
        } else {
          setVisible(true);
        }
      }}>
        {/* <IconMaterial name="transfer" style={{
          color: '#FFF',
          fontSize: RFPercentage(2),
          fontWeight: 'bold',
          textAlign: 'center',
        }} /> */}
      <Text
        style={{
          color: '#FFF',
          fontSize: RFPercentage(2),
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Transfer
      </Text>
    </Button>
    </View>
  );
};

const styles = {
  space: value => {
    return {
      height: value,
    };
  },
};