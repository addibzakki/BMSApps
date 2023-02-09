import React, {useState, useEffect} from 'react';
import {View, StatusBar, TouchableOpacity, Text, Alert} from 'react-native';
import {TopHeader, Select} from '../../../component';
import {colorLogo} from '../../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import axios from 'axios';
import {MeterAPIService} from '../../../services';

const AdminMeterFilter = ({navigation}) => {
  const [type, setType] = useState('');
  const [tenant, setTenant] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [listTenant, setListTenant] = useState([]);
  const [disable, setDisable] = useState(true);
  const [errorEmpty, setErrorEmpty] = useState(false);

  const handleSetType = itemValue => {
    setType(itemValue);
  };

  const handleSetTenant = (itemValue, index) => {
    setTenant(itemValue);
    setTenantName(listTenant[index]['label']);
  };

  const handleShowList = () => {
    if (type === '') {
      setErrorEmpty(true);
    } else {
      navigation.navigate('AdminMeterSearchDashboard', {
        tenant: tenant,
        type: type,
        tenant_name: tenantName,
      });
    }
  };

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      getData();
    }
    return () => {
      unmounted = true;
    };
  }, []);

  const getData = async () => {
    try {
      const res = await MeterAPIService.getTenantList();
      setListTenant([...res.data]);
      setDisable(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  const listType = [
    {
      key: 0,
      id: '',
      label: '-',
    },
    {
      key: 1,
      id: 'WT',
      label: 'Water',
    },
    {
      key: 2,
      id: 'EL',
      label: 'Electric',
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
        title="Meter Search"
        subTitle="Filter"
        onPress={() => navigation.navigate('AdminMeter')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <Alert
        width={80}
        visible={errorEmpty}
        callback={() => setErrorEmpty(false)}
        content={
          <View>
            <Text style={{fontSize: 16, letterSpacing: 1}}>
              Please select type
            </Text>
          </View>
        }
      />
      <View style={styles.space(10)} />
      <View style={styles.wrapper.content}>
        <Select
          list={listTenant}
          placeholder="Tenant"
          selectedValue={tenant}
          onValueChange={handleSetTenant}
        />
        <View style={styles.space(10)} />
        <Select
          list={listType}
          placeholder="type"
          selectedValue={type}
          onValueChange={handleSetType}
        />
      </View>
      <View style={styles.space(20)} />
      <View style={{paddingHorizontal: 20}}>
        <TouchableOpacity
          style={{
            backgroundColor: disable === true ? '#cccccc' : '#303f9f',
            borderRadius: 25,
            paddingVertical: 13,
          }}
          disabled={disable}
          onPress={() => handleShowList()}>
          <Text
            style={{
              color: disable === true ? '#999999' : 'white',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            <MaterialCommunityIcons name="text-search" size={16} /> Show List
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: 'white',
    },
    content: {
      borderRadius: 20,
      marginHorizontal: 15,
    },
    menu: {
      flex: 1,
      borderRadius: 20,
      marginHorizontal: 20,
    },
  },
  modal: {
    backgroundColor: 'white',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
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

export default AdminMeterFilter;
