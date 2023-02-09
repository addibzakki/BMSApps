import React from 'react';
import {View, Text, StatusBar, TouchableOpacity} from 'react-native';
import {colorLogo, colors} from '../../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Comming = ({navigation}) => {
  return (
    <View style={styles.wrapper.page}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colorLogo.color4}
      />
      <Icon name="sign-caution" size={84} color={'yellow'} />
      <Text style={{color: 'white', fontSize: 44, textTransform: 'uppercase'}}>
        Comming Soon
      </Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          padding: 10,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: 'white',
          marginTop: 20,
        }}>
        <Text
          style={{
            fontSize: 24,
            textTransform: 'uppercase',
            fontWeight: 'bold',
            color: 'white',
          }}>
          <Icon name="keyboard-backspace" size={28} /> Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorLogo.color4,
      paddingTop: 25,
    },
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default Comming;
