import React, {useState} from 'react';
import {View, Text, FlatList, RefreshControl, Alert} from 'react-native';
import {ListItem, Left, Body} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextLineIndentLight} from '../../atoms/Text/index';
import {useDispatch, useSelector} from 'react-redux';
import {setPVCheckStandartAttr, setRefresh} from '../../../redux';
import {SkeletonFakeList} from '../../layouts/skeleton/index';
import {global_style} from '../../../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import PreventiveAPIService from '../../../services/Preventive/APIservice';
import {insert_pv_checkstandart_tmp} from '../../databases/insert/insert_pv_checkstandart_tmp';

export const ChecklistPreventive = props => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const handleGoTo = async item => {
    dispatch(setPVCheckStandartAttr(item));
    props.navigation.navigate('PreventiveCheckStandart');
  };

  const renderItem = ({item, index}) => {
    let background_color = item.status_color.replace(/\s/g, '');
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar
        onPress={() => handleGoTo(item)}>
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
          <TextLineIndentLight label="Name" value={item.name} />
          <TextLineIndentLight label="Desc" value={item.description} />
          <TextLineIndentLight
            label="Total"
            value={item.total_check_standard}
          />
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: item.status_color,
            }}
          />
          <TextLineIndentLight
            label="Status"
            value={item.status_name == 'New' ? '-' : item.status_name}
          />
        </Body>
      </ListItem>
    );
  };

  const onRefresh = () => {
    dispatch(setRefresh(true));
  };

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const renderEmpty = () => {
    if (loading == true) {
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
    <View>
      <Spinner
        visible={processing}
        textContent={'Processing...'}
        textStyle={{color: '#FFF'}}
        overlayColor={'rgba(0, 0, 0, 0.60)'}
      />
      <FlatList
        data={props.list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmpty()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={GlobalReducer.refresh}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};
