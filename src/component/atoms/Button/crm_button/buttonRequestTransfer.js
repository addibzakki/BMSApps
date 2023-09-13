import React from 'react';
import {Alert, Text} from 'react-native';
import {Button} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import {CorrectiveAPIService} from '../../../../services';
import {setLoading, setRefresh} from '../../../../redux';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const ButtonRequestTransfer = props => {
  const dispatch = useDispatch();
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const confirmRequestTransfer = () => {
    Alert.alert('Attention!', 'Are you sure want to request transfer?', [
      {text: 'No', onPress: () => console.log('Cancel')},
      {text: 'Yes, Sure!', onPress: () => handleProcess()},
    ]);
  };

  const handleProcess = async () => {
    try {
      const params = {
        ticket_no: CorrectiveReducer.ticket_no,
        username: LoginReducer.form.profile.uid,
        action: 'request',
      };
      console.log(params);
      const res = await CorrectiveAPIService.submitRequestTransferCorrective(
        params,
      );
      dispatch(setRefresh(true));
      dispatch(setLoading(true));
    } catch (error) {
      Alert.alert('Error', error);
    }
  };
  return (
    <Button warning full onPress={() => confirmRequestTransfer()}>
      <Text
        style={{
          color: '#FFF',
          fontSize: RFPercentage(2),
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Request Transfer
      </Text>
    </Button>
  );
};
