import React, {useEffect, useState} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ListType, TopHeader} from '../../../../component';
import {Content} from 'native-base';
import {CorrectiveAPIService} from '../../../../services';
import {global_style} from '../../../../styles';
import {setRefresh} from '../../../../redux';

const AdminHelpdeskType = ({navigation}) => {
  console.log('In Page Type');
  const dispatch = useDispatch();
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [dataType, setListType] = useState([]);

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
    console.log(CorrectiveReducer.ticket_no);
    try {
      const res = await CorrectiveAPIService.getListType(
        CorrectiveReducer.ticket_no,
      );
      setListType(res.data.type);
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
        subTitle="Select Type"
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <ScrollView>
          <View style={global_style.content}>
            <Content>
              <ListType list={dataType} navigation={navigation} />
            </Content>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AdminHelpdeskType;
