import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {ListItem, Left, Body} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextLineIndentLight} from '../../atoms/Text/index';
import {colorLogo} from '../../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {setPVChecklistID, setPVTransCode, setRefresh} from '../../../redux';
import {SkeletonFakeList} from '../../layouts/skeleton/index';
import {global_style} from '../../../styles';

export const ListConfirmationPreventiveSubmit = (props, ...rest) => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [loading, setLoading] = useState(true);

  const goTo = item => {
    dispatch(setPVChecklistID(item.id));
    dispatch(setPVTransCode(item.trans_code));
    props.navigation.navigate('AdminPreventifListShowChecklist');
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
          <Text style={global_style.text_empty}>NO LISTING</Text>
        </View>
      );
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar>
        <Left
          style={{
            backgroundColor: colorLogo.color4,
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: 10,
            }}>
            <Text style={{fontWeight: 'bold'}}>{'#' + item.trans_code}</Text>
            <TouchableOpacity onPress={() => goTo(item)}>
              <Text>Show Detail</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 10,
              borderColor: colorLogo.color1,
            }}
          />
          <TextLineIndentLight label="Assigned" value={item.assign_to} />
          <TextLineIndentLight
            label="Asset"
            value={item.asset_detail.asset_name}
          />
          <TextLineIndentLight label="Type" value={item.asset.type} />
          <TextLineIndentLight label="Brand" value={item.asset.brand} />
          <TextLineIndentLight label="Location" value={item.location.name} />
          <TextLineIndentLight label="Schedule" value={item.schedule_date} />
          <TextLineIndentLight
            label="Barcode"
            value={item.asset_detail.barcode}
          />
        </Body>
      </ListItem>
    );
  };
  return (
    <View>
      <FlatList
        data={props.list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmpty()}
        refreshControl={
          <RefreshControl
            refreshing={GlobalReducer.refresh}
            onRefresh={() => onRefresh()}
          />
        }
        {...rest}
      />
    </View>
  );
};
