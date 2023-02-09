import React, {useEffect, useState} from 'react';
import {View, Alert, Text, FlatList, RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  SkeletonFakeList,
  TextLineIndentLight,
  TopHeader,
} from '../../../../component';
import Icon from 'react-native-vector-icons/Ionicons';
import {global_style} from '../../../../styles';
import {Body, Left, ListItem} from 'native-base';
import {setPVCheckStandartID} from '../../../../redux';
import {PreventiveAPIService} from '../../../../services';

const AdminPreventifListShowChecklist = ({navigation}) => {
  console.log('In Page List Show Checklist Preventif');

  const dispatch = useDispatch();
  const PreventifReducer = useSelector(state => state.PreventifReducer);
  const [list, setList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const getData = async () => {
    try {
      const res = await PreventiveAPIService.getAllChecklist(
        PreventifReducer['checklist_id'],
      );
      console.log(res.data.data);
      setList([...res.data.data]);
      setLoading(false);
      setRefresh(false);
    } catch (error) {
      dispatch(setRefresh(false));
      Alert.alert('Error', error.message);
      setLoading(false);
      setRefresh(false);
    }
  };

  const handleGoTo = async id => {
    dispatch(setPVCheckStandartID(id));
    navigation.navigate('AdminPreventifListShowCheckStandart');
  };

  const renderItem = ({item, index}) => {
    let background_color = item.bms_status.status_color.replace(/\s/g, '');
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar
        onPress={() => handleGoTo(item.id)}>
        <Left
          style={{
            backgroundColor: background_color,
            height: '100%',
            alignItems: 'center',
            paddingTop: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
          <View>
            <Icon
              active
              name="ios-clipboard-outline"
              style={{fontSize: 18, paddingHorizontal: 5, fontWeight: 'bold'}}
              color="white"
            />
          </View>
        </Left>
        <Body>
          <TextLineIndentLight label="Name" value={item.task_group.name} />
          <TextLineIndentLight
            label="Desc"
            value={item.task_group.description}
          />
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: item.bms_status.status_color,
            }}
          />
          <TextLineIndentLight
            label="Status"
            value={
              item.bms_status.status_name === 'New'
                ? '-'
                : item.bms_status.status_name
            }
          />
        </Body>
      </ListItem>
    );
  };

  const onRefresh = () => {
    setRefresh(true);
    getData();
  };

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const renderEmpty = () => {
    if (loading === true) {
      return <SkeletonFakeList row={8} height={110} />;
    } else {
      return (
        <View style={global_style.container_empty}>
          <Text style={global_style.text_empty}>NO LISTING CHECKLIST</Text>
        </View>
      );
    }
  };

  return (
    <View style={global_style.page}>
      <TopHeader
        title="Show Preventive"
        subTitle={'#' + PreventifReducer['trans_code']}
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <View style={[global_style.content, {flex: 1}]}>
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={renderEmpty()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>
    </View>
  );
};

export default AdminPreventifListShowChecklist;
