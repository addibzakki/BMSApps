import React from 'react';
import {Text} from 'react-native';
import {Button} from 'native-base';
import {useDispatch} from 'react-redux';
import {setTypeCorrective} from '../../../../redux';
import {RFPercentage} from 'react-native-responsive-fontsize';

export const ButtonCreateActivity = ({params, navigation}) => {
  const dispatch = useDispatch();
  const handleCreateActivity = () => {
    dispatch(setTypeCorrective('add'));
    navigation.navigate('AdminHelpdeskForm');
  };
  return (
    <Button info full onPress={() => handleCreateActivity()}>
      <Text
        style={{
          color: '#FFF',
          fontSize: RFPercentage(2),
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Create Activity
      </Text>
    </Button>
  );
};
