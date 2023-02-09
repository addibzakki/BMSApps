import React from 'react';
import {View, StatusBar, Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {TopHeader} from '../../../component';
import {colorLogo} from '../../../utils';
import {FlatGrid} from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/Ionicons';

const AdminMeterReadingDashboard = ({navigation}) => {
  const MeterReducer = useSelector(state => state.MeterReducer);

  const data_menu = [
    {
      key: 1,
      title: 'Reading',
      icon: 'md-speedometer-outline',
      nav: () => navigation.navigate('AdminMeterReading'),
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
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colorLogo.color2}
      />
      <TopHeader
        title="Meter"
        subTitle={MeterReducer.info.tenant_name}
        onPress={() => navigation.navigate('AdminMeter')}
      />
      <View style={styles.space(10)} />
      <FlatGrid
        itemDimension={130}
        data={data_menu}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={item.nav}
            style={{
              backgroundColor: colorLogo.color4,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              paddingVertical: 10,
              height: 150,
              flex: 1,
            }}>
            <Icon name={item.icon} size={24} color="white" />
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: 'white',
    },
    menu: {
      flex: 1,
      borderRadius: 20,
      marginHorizontal: 20,
    },
  },
  utils: {
    text: {
      fontSize: 16,
    },
  },
  text: {
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: colorLogo.color3,
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default AdminMeterReadingDashboard;
