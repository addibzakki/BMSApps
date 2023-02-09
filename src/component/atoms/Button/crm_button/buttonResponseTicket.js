import React from 'react';
import {Text, Alert, View} from 'react-native';
import {Button} from 'native-base';
import {CorrectiveAPIService} from '../../../../services';
import {useDispatch, useSelector} from 'react-redux';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {setLoading, setRefresh} from '../../../../redux';

export const ButtonResponseTicket = props => {
  const dispatch = useDispatch();
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);

  const handleResponseActivity = async () => {
    try {
      dispatch(setLoading(true));
      const params = {
        type: 'response-ticket',
        ticket_no: CorrectiveReducer.ticket_no,
        eng_username: LoginReducer.form.profile.uid,
        eng_level: LoginReducer.form.profile.level,
        status: 1,
      };
      const res = await CorrectiveAPIService.submitUpdateStatusCorrective(
        params,
      );
      if (res.data.message == 'success') {
        dispatch(setLoading(false));
        dispatch(setRefresh(true));

        // props.navigation.replace('AdminHelpdeskDashboard');
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

  const confirmResponseActivity = () => {
    Alert.alert('Confirmation!', 'Do you want response this ticket?', [
      {
        text: 'No',
        onPress: () => console.log('cancel'),
        style: 'cancel',
      },
      {text: 'Yes, Sure!', onPress: () => handleResponseActivity()},
    ]);
  };

  return (
    <View style={{flex: 1}}>
      <Button warning full onPress={() => confirmResponseActivity()}>
        <Text
          style={{
            color: '#FFF',
            fontSize: RFPercentage(2),
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Response Ticket
        </Text>
      </Button>
    </View>
  );
};
