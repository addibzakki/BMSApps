import React, {useEffect, useState} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {ListPriority, TopHeader} from '../../../../component';
import {Content} from 'native-base';
import {CorrectiveAPIService} from '../../../../services';
import {global_style} from '../../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {setRefresh} from '../../../../redux';

const AdminHelpdeskPriority = ({navigation}) => {
  console.log('In Page Priority');
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [dataPriority, setListPriority] = useState([]);

  useEffect(() => {
    // when refresh : true
    if (GlobalReducer.refresh === true) {
      getData();
    }
    // when focused : true
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation, GlobalReducer.refresh === true]);

  const getData = async () => {
    try {
      const res = await CorrectiveAPIService.getListPriority();
      setListPriority(res.data.priority);
      dispatch(setRefresh(false));
    } catch (error) {
      Alert.alert('Error', error);
      dispatch(setRefresh(false));
    }
  };

  return (
    <View style={global_style.page}>
      <TopHeader
        title="Assignment"
        subTitle="Select Priority"
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <ScrollView>
          <View style={global_style.content}>
            <Content>
              <ListPriority list={dataPriority} navigation={navigation} />
            </Content>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AdminHelpdeskPriority;
