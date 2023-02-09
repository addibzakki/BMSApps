import React, {useEffect, useState} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ListCategory, TopHeader} from '../../../../component';
import {Content} from 'native-base';
import {CorrectiveAPIService} from '../../../../services';
import {global_style} from '../../../../styles';
import {setRefresh} from '../../../../redux';

const AdminHelpdeskCategory = ({navigation}) => {
  console.log('in page category');
  const dispatch = useDispatch();
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [dataCategory, setListCategory] = useState([]);
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
      const res = await CorrectiveAPIService.getListCategory(
        CorrectiveReducer.ticket_type,
      );
      setListCategory(res.data.category);
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
        subTitle="Select Category"
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <ScrollView>
          <View style={global_style.content}>
            <Content>
              <ListCategory list={dataCategory} navigation={navigation} />
            </Content>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AdminHelpdeskCategory;
