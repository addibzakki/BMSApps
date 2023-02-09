import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {colorButton} from '../../../../utils';
export const ButtonActionDetail = props => {
  const [loading, setLoading] = useState(false);
  return (
    <View>
      <Spinner
        visible={loading}
        textContent={'Update status detail preventif...'}
        textStyle={{color: '#FFF'}}
      />
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginRight: 10,
        }}>
        <TouchableOpacity
          onPress={() => handleProcess(13)}
          style={{
            borderRadius: 20,
            backgroundColor: colorButton.submit,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
            width: '30%',
          }}>
          <Text
            style={{
              color: '#FFF',
            }}>
            Ok
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleProcess(14)}
          style={{
            borderRadius: 20,
            backgroundColor: colorButton.cancel,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
            width: '30%',
          }}>
          <Text
            style={{
              color: '#FFF',
            }}>
            Not Ok
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleProcess(16)}
          style={{
            borderRadius: 20,
            backgroundColor: colorButton.transfer,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
            width: '30%',
          }}>
          <Text
            style={{
              color: '#FFF',
            }}>
            To Corrective
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
