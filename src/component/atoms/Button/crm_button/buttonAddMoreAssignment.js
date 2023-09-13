import React from 'react';
import {Text} from 'react-native';
import {Button} from 'native-base';
import { useDispatch } from 'react-redux';
import {
  setTicketPriorityCorrective,
  setTypeCorrective,
  setTicketTypeCorrective,
  setTicketCategoryCorrective,
} from '../../../../redux';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const ButtonAddMoreAssigment = props => {
  const dispatch = useDispatch();
  const handleGoTo = () => {
    dispatch(setTicketPriorityCorrective(props.data.priority_id));
    dispatch(setTicketTypeCorrective(props.data.type_id));
    dispatch(setTicketCategoryCorrective(props.data.category_id));
    dispatch(setTypeCorrective('add-more'));
    props.navigation.navigate('AdminHelpdeskEngineer');
  };
  return (
    <Button
      primary
      full
      onPress={() => handleGoTo()}
      style={{borderRightColor: '#ccc', borderRightWidth: 1}}>
      <Text
        style={{
          color: '#FFF',
          fontSize: RFPercentage(2),
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Add More Assignment
      </Text>
    </Button>
  );
};
