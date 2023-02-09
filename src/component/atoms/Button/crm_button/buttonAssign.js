import React from 'react';
import {Text} from 'react-native';
import {Button} from 'native-base';
import {useDispatch} from 'react-redux';
import {
  setTicketCategoryCorrective,
  setTicketPriorityCorrective,
  setTicketTypeCorrective,
  setTypeCorrective,
} from '../../../../redux';

export const ButtonAssign = props => {
  const dispatch = useDispatch();
  const handleGoTo = () => {
    if (props.data.type_desc == null && props.data.category_desc == null) {
      dispatch(setTypeCorrective('assignment'));
      props.navigation.navigate('AdminHelpdeskPriority');
    } else {
      dispatch(setTypeCorrective('assignment'));
      dispatch(setTicketPriorityCorrective(props.data.priority_id));
      dispatch(setTicketTypeCorrective(props.data.type_id));
      dispatch(setTicketCategoryCorrective(props.data.category_id));
      props.navigation.navigate('AdminHelpdeskEngineer');
    }
  };
  return (
    <Button
      info
      full
      onPress={() => handleGoTo()}
      style={{borderRightColor: '#ccc', borderRightWidth: 1}}>
      <Text
        style={{
          color: '#FFF',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Assign To Engineer
      </Text>
    </Button>
  );
};
