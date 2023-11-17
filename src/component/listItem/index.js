import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {ListItem, Left, Body, Right, Badge} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {ButtonIconBadge} from '../atoms/Button/index';
import {SkeletonFakeMenu} from '../layouts/skeleton/index';
import {FlatGrid} from 'react-native-super-grid';
import {colorLogo} from '../../utils';
import {useDispatch, useSelector} from 'react-redux';
import {setRefresh} from '../../redux';
import {TextLineIndentLight} from '../atoms/Text/index';
import {RFPercentage} from 'react-native-responsive-fontsize';
import moment from 'moment';
moment.locale('id');
export const ListItemSPL = ({
  list,
  navigation,
  onRefresh,
  refresh,
  ...rest
}) => {
  const handleNavigation = spl_cd => {
    navigation.navigate('ShowSPL', {
      spl_cd: spl_cd,
    });
  };

  const renderItem = ({item, index}) => {
    if (item.request_status == 'W') {
      var status_color = 'orange';
    } else if (item.request_status == 'T') {
      var status_color = 'blue';
    } else if (item.request_status == 'C') {
      var status_color = 'green';
    } else {
      var status_color = 'red';
    }
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar
        onPress={() => handleNavigation(item.spl_cd)}>
        <Left
          style={{
            backgroundColor: status_color,
            height: '100%',
            alignItems: 'center',
            paddingTop: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
          <View>
            <Icon
              active
              name="bookmarks-outline"
              style={{fontSize: 18, paddingHorizontal: 5, fontWeight: 'bold'}}
              color="white"
            />
          </View>
        </Left>
        <Body>
          <Text style={{fontWeight: 'bold'}}>{'#' + item.spl_cd}</Text>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: status_color,
            }}
          />
          <TextLineIndentLight label="Requester" value={item.engineer_name} />
          <TextLineIndentLight
            label="Date"
            value={moment(item.request_date).format('DD MMMM YYYY')}
          />
          <TextLineIndentLight label="Location" value={item.location_descs} />
          <TextLineIndentLight label="Status" value={item.status_descs} />
        </Body>
      </ListItem>
    );
  };

  return (
    <FlatList
      data={list}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }
      {...rest}
    />
  );
};

export const ListArrow = ({list, onPress}) => {
  const renderItem = ({item, index}) => {
    return (
      <View>
        <ListItem onPress={onPress} style={{paddingLeft: 0, marginLeft: 0}}>
          <Body>
            <Text style={{marginLeft: 15}}>{item.label}</Text>
          </Body>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </ListItem>
      </View>
    );
  };

  return (
    <FlatList
      data={list}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export const ListMenu = ({list, navigation}) => {
  const handleGoTo = screen => {
    navigation.navigate(screen);
  };

  const renderItem = ({item, index}) => {
    return (
      <ButtonIconBadge
        notif={item.notification}
        value={item.notification_val}
        title={item.title}
        icon={item.icon}
        onPress={() => handleGoTo(item.route)}
      />
    );
  };

  const renderEmpty = () => {
    setTimeout(() => {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            NO MENU SETTING
          </Text>
        </View>
      );
    }, 2000);
    return <SkeletonFakeMenu row={4} />;
  };

  return (
    <FlatGrid
      removeClippedSubviews={true}
      data={list}
      itemDimension={50}
      itemContainerStyle={{
        // justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center',
      }}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty()}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export const ListMenuGrid = props => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const AreaReducer = useSelector(state => state.AreaReducer);
  const handleGoTo = screen => {
    // const screenIgnore = ['RequestSPL'];
    // if (screenIgnore.includes(screen)) {
    //   if (AreaReducer.available == true) {
    //     props.navigation.navigate(screen);
    //   } else {
    //     Alert.alert(
    //       'Attention!',
    //       'You cant request SPL before you scan work area!',
    //     );
    //   }
    // } else {
    //   props.navigation.navigate(screen);
    // }

    props.navigation.navigate(screen);
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => handleGoTo(item.nav)}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.32,
          shadowRadius: 5.46,

          elevation: 9,
          backgroundColor: colorLogo.color4,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          paddingVertical: 10,
          height: 150,
          flex: 1,
        }}>
        {item.badge == true && (
          <View style={{position: 'absolute', top: 10, right: 10}}>
            <Badge style={{position: 'absolute', top: 0, right: 0}}>
              <Text style={{color: '#FFFFFF', fontSize: RFPercentage(2)}}>
                {item.count}
              </Text>
            </Badge>
          </View>
        )}

        <Icon
          name={item.icon}
          size={50}
          color="white"
          style={{marginBottom: 5}}
        />
        <Text
          style={{
            color: 'white',
            fontSize: RFPercentage(1.5),
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatGrid
      fixed={false}
      itemDimension={props.itemDimension}
      data={props.list}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={GlobalReducer.refresh}
          onRefresh={() => dispatch(setRefresh(true))}
        />
      }
    />
  );
};
