import React, {useEffect, useState} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {ListPurpose, TopHeader} from '../../../../component';
import {Content} from 'native-base';
import {CorrectiveAPIService} from '../../../../services';
import {global_style} from '../../../../styles';
import {useDispatch, useSelector} from 'react-redux';
import {setRefresh} from '../../../../redux';

const AdminHelpdeskPurpose = ({navigation}) => {
  console.log('In Page Purpose');
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [dataPurpose, setListPurpose] = useState([]);

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
      const res = await CorrectiveAPIService.getListPurpose();
      setListPurpose(res.data.purpose);
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
        subTitle="Select Purpose Assignment"
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <ScrollView>
          <View style={global_style.content}>
            <Content>
              <ListPurpose list={dataPurpose} navigation={navigation} />
            </Content>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AdminHelpdeskPurpose;
