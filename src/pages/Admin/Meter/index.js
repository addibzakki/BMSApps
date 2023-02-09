import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {TopHeader} from '../../../component';
import {colorLogo} from '../../../utils';
import {FlatGrid} from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/Ionicons';

const AdminMeter = ({navigation}) => {
  const data_menu = [
    {
      key: 1,
      title: 'Meter Reading',
      icon: 'md-speedometer-outline',
      nav: () => navigation.navigate('AdminMeterBarcode'),
    },
    {
      key: 2,
      title: 'History',
      icon: 'md-calendar-outline',
      nav: () => navigation.navigate('AdminMeterHistory'),
    },
  ];

  return (
    <View style={styles.wrapper.page}>
      <TopHeader
        title="Meter"
        onPress={() => navigation.navigate('AdminDashboard')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.wrapper.subPage}>
        <FlatGrid
          itemDimension={130}
          data={data_menu}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={item.nav}
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,

                elevation: 9,
                backgroundColor: colorLogo.color4,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                paddingVertical: 10,
                height: 150,
                flex: 1,
              }}>
              <Icon
                name={item.icon}
                size={50}
                color="white"
                style={{marginBottom: 5}}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: colorLogo.color4,
    },
    subPage: {
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: 'white',
    },
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default AdminMeter;
