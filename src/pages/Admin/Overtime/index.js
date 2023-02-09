import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {TopHeader} from '../../../component';
import {colorLogo} from '../../../utils';
import {FlatGrid} from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {Badge} from 'native-base';
import axios from 'axios';
import {RFPercentage} from 'react-native-responsive-fontsize';

const AdminOvertime = ({navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [totalRequest, setTotalRequest] = useState(0);
  const [totalRequestModif, setTotalRequestModif] = useState(0);
  const [totalList, setTotalList] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return () => {
      unsubscribe;
    };
  }, []);

  const getData = () => {
    const url = 'https://mynet.mmproperty.com/api/count_overtime';
    axios
      .post(url, {
        username: LoginReducer.form.profile.uid,
        level: LoginReducer.form.profile.level,
      })
      .then(function(response) {
        setTotalRequest(response.data.totalRequest);
        setTotalRequestModif(response.data.totalRequestModif);
        console.log(response.data.totalList);
        setTotalList(response.data.totalList);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const data_menu = [
    {
      key: 1,
      title: 'Overtime Request',
      icon: 'ios-clipboard-outline',
      color: colorLogo.color4,
      total: totalRequest,
      nav: () => navigation.navigate('AdminOvertimeList', {status: '1'}),
    },
    {
      key: 2,
      title: 'Modify Request',
      icon: 'ios-create-outline',
      color: colorLogo.color4,
      total: totalRequestModif,
      nav: () => navigation.navigate('AdminOvertimeList', {status: '8'}),
    },
    // {
    //   key: 3,
    //   title: 'Report',
    //   icon: 'md-cloud-upload-outline',
    //   color: colorLogo.color4,
    //   total: 0,
    //   nav: () => navigation.navigate('AdminOvertimeReport'),
    // },
    {
      key: 4,
      title: 'Listing',
      icon: 'md-list',
      color: colorLogo.color4,
      total: totalList,
      nav: () => navigation.navigate('AdminOvertimeList', {status: 'all'}),
    },
  ];

  return (
    <View style={styles.wrapper.page}>
      <TopHeader
        title="Overtime"
        subTitle="Menu"
        onPress={() => navigation.navigate('AdminDashboard')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.wrapper.subPage}>
        <FlatGrid
          itemDimension={90}
          data={data_menu}
          contentContainerStyle={{alignItems: 'center'}}
          // spacing={20}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={item.nav}
              style={{
                backgroundColor: item.color,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                paddingVertical: 5,
                height: 90,
                flex: 1,
              }}>
              <Icon name={item.icon} size={25} color="white" />
              {item.total != 0 && (
                <Badge style={{position: 'absolute', top: 5, right: 5}}>
                  <Text style={{fontSize: RFPercentage(1.5), color: 'white'}}>
                    {item.total}
                  </Text>
                </Badge>
              )}
              <View style={styles.space(10)} />
              <Text
                style={{
                  color: 'white',
                  fontSize: RFPercentage(1.5),
                  // fontWeight: 'bold',
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
    menu: {
      flex: 1,
      borderRadius: 20,
      marginHorizontal: 20,
    },
    subPage: {
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: 'white',
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

export default AdminOvertime;
