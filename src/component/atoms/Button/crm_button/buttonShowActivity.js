import React from 'react';
import {Text} from 'react-native';
import {Button} from 'native-base';

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
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Activity
      </Text>
    </Button>
  );
};
