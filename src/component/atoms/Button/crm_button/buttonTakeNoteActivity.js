import React from 'react';
import {Text} from 'react-native';
import {Button} from 'native-base';
import {useDispatch} from 'react-redux';
import {setTypeCorrective} from '../../../../redux';
import {RFPercentage} from 'react-native-responsive-fontsize';

export const ButtonTakeNoteActivity = ({params, navigation}) => {
  const dispatch = useDispatch();
  const handleCreateActivity = () => {
    dispatch(setTypeCorrective('take-note'));
    navigation.navigate('AdminHelpdeskForm');
  };
  return (
    <Button warning full onPress={() => handleCreateActivity()}>
      <Text
        style={{
          color: '#FFF',
          fontSize: RFPercentage(2),
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Take Note
      </Text>
    </Button>
  );
};
