import React from 'react';
import {Text} from 'react-native';
import {Button} from 'native-base';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const ButtonShowActivity = props => {
  const handleGoTo = () => {
    props.navigation.navigate('AdminHelpdeskActivity');
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
          fontSize: RFPercentage(2),
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Activity
      </Text>
    </Button>
  );
};
