import React, {useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {ListItem, Left, Body} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextLineIndentLight} from '../../atoms/Text/index';
import {useDispatch} from 'react-redux';
import {setPVTransCode, setRefresh} from '../../../redux';
import {SkeletonFakeList} from '../../layouts/skeleton/index';
import {global_style} from '../../../styles';

export const ListHistoryPreventif = props => {
  console.log('tes');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const handleGoTo = item => {
    dispatch(setPVTransCode(item.trans_code));
    props.navigation.navigate('AdminPreventifListShowHistoryChecklist');
  };

  const renderItem = ({item, index}) => {
    console.log(item);
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
            backgroundColor: item.bms_status.status_color,
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
          <Text style={{fontWeight: 'bold'}}>{'#' + item.trans_code}</Text>
          <Text style={{fontWeight: 'bold'}}>{item.assign_date}</Text>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: item.bms_status.status_color,
            }}
          />
          <TextLineIndentLight
            label="Status"
            value={item.bms_status.status_name}
          />
          <TextLineIndentLight label="Type" value={item.asset.type} />
          <TextLineIndentLight label="Lokasi" value={item.location.name} />
          <TextLineIndentLight label="Schedule" value={item.schedule_date} />
          <TextLineIndentLight
            label="Barcode ID"
            value={item.asset_detail.barcode}
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
    if (loading === true) {
      return <SkeletonFakeList row={8} height={110} />;
    } else {
      return (
        <View style={global_style.container_empty}>
          <Text style={global_style.text_empty}>NO LISTING HISTORY</Text>
        </View>
      );
    }
  };

  return (
    <FlatList
      data={props.list}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={renderEmpty()}
      showsVerticalScrollIndicator={false}
    />
  );
};
