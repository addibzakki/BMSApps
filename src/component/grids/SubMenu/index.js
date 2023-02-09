import React, {useState} from 'react';
import {View, TouchableOpacity, RefreshControl} from 'react-native';
import {Badge, Text} from 'native-base';
import {FlatGrid} from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SkeletonBox} from '../../layouts/skeleton/index';
import {
  setListState,
  setRefresh,
  setTicketStatusIDCorrective,
} from '../../../redux';
import {global_style} from '../../../styles';

export const SubMenuCorrective = props => {
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const handleGoTo = item => {
    dispatch(setListState(item.status_name));
    dispatch(setTicketStatusIDCorrective(item.status_id));
    props.navigation.navigate('AdminHelpdeskList');
  };
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => handleGoTo(item)}
        style={global_style.sub_menu_button_container}>
        <Icon name={item.status_icon} size={25} color="white" />
        {item.status_total != 0 && (
          <Badge style={global_style.badge_square_container}>
            <Text style={global_style.font_badge}>{item.status_total}</Text>
          </Badge>
        )}
        <View style={global_style.space(10)} />
        <Text style={global_style.text_sub_menu}>{item.status_name}</Text>
      </TouchableOpacity>
    );
  };

  const onRefresh = () => {
    dispatch(setRefresh(true));
  };

  const renderEmpty = () => {
    return (
      <View style={global_style.container_empty}>
        <Text style={global_style.text_empty}>NO MENU SETTING</Text>
      </View>
    );
  };

  const content = () => {
    if (loading == true) {
      return (
        <View style={{paddingTop: 10}}>
          <SkeletonBox />
        </View>
      );
    } else {
      return (
        <FlatGrid
          removeClippedSubviews={false}
          itemDimension={90}
          data={CorrectiveReducer.list_menu}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={GlobalReducer.refresh}
              onRefresh={() => onRefresh()}
            />
          }
        />
      );
    }
  };

  return content();
};
