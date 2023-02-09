import React from 'react';
import {View, StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import {TopHeader} from '../../../component';
import {colorLogo} from '../../../utils';
const AdminMeterHistory = ({navigation}) => {
  const MeterReducer = useSelector(state => state.MeterReducer);
  return (
    <View style={styles.wrapper.page}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colorLogo.color2}
      />
      <TopHeader
        title="Meter History"
        subTitle={MeterReducer.info.tenant_name}
        onPress={() => navigation.navigate('AdminMeter')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.space(10)} />
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

export default AdminMeterHistory;
