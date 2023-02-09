import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  ListItem,
  Left,
  Body,
  Right,
  Icon,
  CheckBox,
  List,
  Content,
  Thumbnail,
  Badge,
} from 'native-base';
import {TextLineIndentLight} from '../../atoms/Text/index';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {
  setParamsRouteCorrective,
  setTicketPriorityCorrective,
  setTicketTypeCorrective,
  setTicketCategoryCorrective,
  setListEngineerCorrective,
  setRefresh,
  setPICCorrective,
  setTypeCorrective,
  setRunIDCorrective,
  setStateDataCorrective,
  setTicketPurposeCorrective,
} from '../../../redux';
import {SkeletonFakeList} from '../../layouts/skeleton/index';
import {global_style} from '../../../styles';
import {CorrectiveAPIService} from '../../../services';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {userAvatar} from '../../../assets';
import GlobalContext from '../../GlobalContext';
import {colorLogo} from '../../../utils';

export const ListTicket = (props, ...rest) => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [loading, setLoading] = useState(true);
  const handleGoTo = item => {
    dispatch(setParamsRouteCorrective(item));
    props.navigation.navigate('AdminHelpdeskShow');
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
        avatar
        onPress={() => handleGoTo(item)}>
        <Left
          style={{
            backgroundColor: item.status_color,
            height: '100%',
            alignItems: 'center',
            paddingTop: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
          <View>
            <Ionicons
              active
              name="bookmarks-outline"
              style={{fontSize: 18, paddingHorizontal: 5, fontWeight: 'bold'}}
              color="white"
            />
          </View>
        </Left>
        <Body>
          <Text style={{fontWeight: 'bold'}}>
            {'#' + item.tenant_ticket_id}
          </Text>
          <Text style={{fontWeight: 'bold'}}>
            {moment(item.tenant_ticket_post).format('DD/MMM/YYYY hh:mm A')}
          </Text>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: item.status_color,
            }}
          />
          <TextLineIndentLight label="Form" value={item.form_desc} />
          {item.type_desc != null && (
            <TextLineIndentLight label="Type" value={item.type_desc} />
          )}
          {item.category_desc != null && (
            <TextLineIndentLight label="Category" value={item.category_desc} />
          )}
          <TextLineIndentLight
            label="Location"
            value={item.tenant_ticket_location}
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
    return (
      <View style={global_style.container_empty}>
        <Text style={global_style.text_empty}>NO LISTING TICKET</Text>
      </View>
    );
  };

  const content = () => {
    if (loading == true) {
      return <SkeletonFakeList row={4} height={110} />;
    } else {
      return (
        <FlatList
          removeClippedSubviews={false}
          data={props.list}
          disableVirtualization={false}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={GlobalReducer.refresh}
              onRefresh={onRefresh}
            />
          }
          {...rest}
        />
      );
    }
  };

  return content();
};

export const ListPriority = (props, ...rest) => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);
  const handleGoTo = item => {
    dispatch(setTicketPriorityCorrective(item.value));
    props.navigation.navigate('AdminHelpdeskType');
  };
  const renderItem = ({item, index}) => {
    return (
      <View>
        <ListItem
          onPress={() => handleGoTo(item)}
          style={{paddingLeft: 0, marginLeft: 0}}>
          <Body>
            <Text style={{marginLeft: 15}}>{item.label}</Text>
          </Body>
          <Right>
            <Icon
              type="MaterialIcons"
              name="error"
              style={{color: item.color, fontSize: 20}}
            />
          </Right>
        </ListItem>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          NO PRIORITY SETUP
        </Text>
      </View>
    );
  };

  const content = () => {
    if (loading == true) {
      return <SkeletonFakeList row={3} height={50} />;
    } else {
      return (
        <FlatList
          removeClippedSubviews={false}
          data={props.list}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty()}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={GlobalReducer.refresh}
              onRefresh={() => dispatch(setRefresh(true))}
            />
          }
          {...rest}
        />
      );
    }
  };

  return content();
};

export const ListPurpose = (props, ...rest) => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);
  const handleGoTo = item => {
    dispatch(setTicketPurposeCorrective(item.value));
    props.navigation.navigate('AdminHelpdeskEngineer');
  };
  const renderItem = ({item, index}) => {
    return (
      <View>
        <ListItem
          onPress={() => handleGoTo(item)}
          style={{paddingLeft: 0, marginLeft: 0}}>
          <Body>
            <Text style={{marginLeft: 15}}>{item.label}</Text>
          </Body>
          <Right>
            <Icon
              type="MaterialIcons"
              name="error"
              style={{color: item.color, fontSize: 20}}
            />
          </Right>
        </ListItem>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>NO PURPOSE SETUP</Text>
      </View>
    );
  };

  const content = () => {
    if (loading == true) {
      return <SkeletonFakeList row={3} height={50} />;
    } else {
      return (
        <FlatList
          removeClippedSubviews={false}
          data={props.list}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty()}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={GlobalReducer.refresh}
              onRefresh={() => dispatch(setRefresh(true))}
            />
          }
          {...rest}
        />
      );
    }
  };

  return content();
};

export const ListType = (props, ...rest) => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);
  const handleGoTo = item => {
    dispatch(setTicketTypeCorrective(item.value));
    props.navigation.navigate('AdminHelpdeskPurpose');
  };
  const renderItem = ({item, index}) => {
    return (
      <View>
        <ListItem
          onPress={() => handleGoTo(item)}
          style={{paddingLeft: 0, marginLeft: 0}}>
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

  const renderEmpty = () => {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>NO TYPE SETUP</Text>
      </View>
    );
  };

  const content = () => {
    if (loading == true) {
      return <SkeletonFakeList row={2} height={50} />;
    } else {
      return (
        <FlatList
          removeClippedSubviews={false}
          data={props.list}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty()}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={GlobalReducer.refresh}
              onRefresh={() => dispatch(setRefresh(true))}
            />
          }
          {...rest}
        />
      );
    }
  };

  return content();
};

export const ListCategory = (props, ...rest) => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);
  const handleGoTo = item => {
    dispatch(setTicketCategoryCorrective(item.value));
    props.navigation.navigate('AdminHelpdeskEngineer');
  };
  const renderItem = ({item, index}) => {
    return (
      <View>
        <ListItem
          onPress={() => handleGoTo(item)}
          style={{paddingLeft: 0, marginLeft: 0}}>
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

  const renderEmpty = () => {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          NO CATEGORY SETUP
        </Text>
      </View>
    );
  };

  const content = () => {
    if (loading == true) {
      return <SkeletonFakeList row={4} height={50} />;
    } else {
      return (
        <FlatList
          removeClippedSubviews={false}
          data={props.list}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty()}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={GlobalReducer.refresh}
              onRefresh={() => dispatch(setRefresh(true))}
            />
          }
          {...rest}
        />
      );
    }
  };

  return content();
};

export const ListEngineer = (props, ...rest) => {
  const dispatch = useDispatch();
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 2000);
  const chkbox_check = (item, ind) => {
    let tmp = props.list;
    let res = '';
    if (tmp.includes(item)) {
      if (item.isChecked == 'true') {
        tmp.find(tmp => tmp.username == item.username).isChecked = 'false';
      } else {
        tmp.find(tmp => tmp.username == item.username).isChecked = 'true';
      }
    }
    dispatch(setListEngineerCorrective([...tmp]));
  };

  const HandleConfirmTransfer = transfer_to => {
    Alert.alert(
      'Attention',
      'Are you sure want to transfer this ticket to selected pic?',
      [
        {text: 'No', onPress: () => console.log('Cancel')},
        {text: 'Yes, Sure!', onPress: () => HandleSetPIC(transfer_to)},
      ],
    );
  };

  const HandleSetPIC = async transfer_to => {
    setLoading(true);
    try {
      const params = {
        ticket_no: CorrectiveReducer.ticket_no,
        username: CorrectiveReducer.pic_selected,
        transfer_to: transfer_to,
        assignment_from: LoginReducer.form.profile.uid,
        action: CorrectiveReducer.type,
      };
      const res = await CorrectiveAPIService.submitActionAssignmentCorrective(
        params,
      );
      props.navigation.replace('AdminHelpdeskShow');
    } catch (error) {
      Alert.alert('Error', error);
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <View>
        <ListItem
          onPress={() => HandleConfirmTransfer(item.username)}
          style={{paddingLeft: 0, marginLeft: 0}}>
          <Body>
            <Text style={{marginLeft: 15}}>
              <Ionicons name="chevron-forward" size={16} /> {item.fullname}
            </Text>
          </Body>
          <Right>
            <Text>
              {item.status == 'On Dutty' ? '(' + item.status + ')' : ''}
            </Text>
          </Right>
        </ListItem>
      </View>
    );
  };

  const renderData = ({item, index}) => {
    let ChkBox;
    if (props.level == 'Supervisor') {
      ChkBox = (
        <ListItem
          onPress={() => chkbox_check(item, index)}
          style={{paddingLeft: 0, marginLeft: 0}}>
          <CheckBox
            onPress={() => chkbox_check(item, index)}
            checked={props.list[index].isChecked == 'true' ? true : false}
            style={{paddingLeft: 0, marginLeft: 0, marginTop: 0, paddingTop: 0}}
          />
          <Body>
            <Text style={{marginLeft: 15}}>{item.fullname}</Text>
          </Body>
          <Right>
            <Text>
              {item.status == 'On Dutty' ? '(' + item.status + ')' : ''}
            </Text>
          </Right>
        </ListItem>
      );
    }
    return <View>{ChkBox}</View>;
  };

  const renderEmpty = () => {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          NO ONE ALREADY TO ASSIGN
        </Text>
      </View>
    );
  };

  const content = () => {
    if (loading == true) {
      return <SkeletonFakeList row={4} height={50} />;
    } else {
      return (
        <FlatList
          removeClippedSubviews={false}
          data={props.list}
          renderItem={props.type != 'transfer' ? renderData : renderItem}
          ListEmptyComponent={renderEmpty()}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={GlobalReducer.refresh}
              onRefresh={() => dispatch(setRefresh(true))}
            />
          }
          {...rest}
        />
      );
    }
  };

  return content();
};

export const ListAssignment = (props, ...rest) => {
  const dispatch = useDispatch();
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const handleConfirmActionAssignment = action => {
    Alert.alert(
      'Attention',
      'Are you sure want to unassign this pic from this ticket?',
      [
        {text: 'No', onPress: () => console.log('Cancel')},
        {text: 'Yes, Sure!', onPress: () => actionAssignment(action)},
      ],
    );
  };

  const actionAssignment = async action_taken => {
    try {
      const params = {
        ticket_no: CorrectiveReducer.ticket_no,
        username: CorrectiveReducer.pic_selected,
        action: action_taken,
      };
      const res = await CorrectiveAPIService.submitActionAssignmentCorrective(
        params,
      );

      // setDataEngineer(res.data.engineer);
      dispatch(setRefresh(true));
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  const confirmTransferPIC = () => {
    Alert.alert(
      'Confirmation!',
      'Are you sure to confirm transfer this PIC to another pic?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('cancel'),
          style: 'cancel',
        },
        {text: 'Reject', onPress: () => HandleChangeStatusAssignment()},
        {
          text: 'Accept',
          onPress: () => {
            dispatch(setTypeCorrective('transfer'));
            props.navigation.navigate('AdminHelpdeskEngineer');
          },
        },
      ],
    );
  };

  const HandleChangeStatusAssignment = async () => {
    try {
      const params = {
        ticket_no: CorrectiveReducer.ticket_no,
        username: CorrectiveReducer.pic_selected,
        action: 'reject',
      };
      const res = await CorrectiveAPIService.submitRequestTransferCorrective(
        params,
      );
      dispatch(setRefresh(true));
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  const renderItem = ({item, index}) => {
    let ChkBox;
    if (props.list[index].isChecked == 'true') {
      let subMenu;
      if (LoginReducer.form.profile.level == 'Supervisor') {
        if (item.status_assignment == 'R') {
          subMenu = (
            <Right>
              <TouchableOpacity
                style={{
                  width: 120,
                  padding: 5,
                  borderRadius: 10,
                  backgroundColor: 'orange',
                }}
                onPress={() => {
                  dispatch(setPICCorrective(item.username));
                  confirmTransferPIC();
                }}>
                {/* <Icon type="FontAwesome" name="share" size={14} /> */}
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Request Transfer
                </Text>
              </TouchableOpacity>
            </Right>
          );
        } else {
          subMenu = (
            <Right>
              <Menu>
                <MenuTrigger
                  style={{
                    width: 20,
                    alignItems: 'center',
                  }}>
                  <Icon type="FontAwesome" name="ellipsis-v" size={18} />
                </MenuTrigger>
                <MenuOptions
                  customStyles={{
                    optionsContainer: {
                      padding: 5,
                      width: '30%',
                    },
                  }}>
                  <MenuOption
                    onSelect={() => {
                      dispatch(setPICCorrective(item.username));
                      dispatch(setTypeCorrective('transfer'));
                      props.navigation.navigate('AdminHelpdeskEngineer');
                    }}
                    text="Transfer"
                  />
                  <View
                    style={{
                      marginVertical: 5,
                      marginHorizontal: 2,
                      borderBottomWidth: 1,
                      borderColor: '#ccc',
                    }}
                  />
                  <MenuOption
                    onSelect={() => {
                      dispatch(setPICCorrective(item.username));
                      handleConfirmActionAssignment('checkout');
                    }}
                    text="Unassign"
                  />
                </MenuOptions>
              </Menu>
            </Right>
          );
        }
      }
      ChkBox = (
        <ListItem
          style={{
            paddingLeft: 0,
            marginLeft: 0,
            paddingRight: 0,
          }}>
          <CheckBox
            checked={true}
            style={{paddingLeft: 0, marginLeft: 0, marginTop: 0, paddingTop: 0}}
          />
          <Body>
            <Text style={{marginLeft: 15}}>{item.fullname}</Text>
          </Body>
          {subMenu}
        </ListItem>
      );
    } else {
      ChkBox = (
        <ListItem
          style={{
            paddingLeft: 0,
            marginLeft: 0,
            paddingRight: 0,
          }}>
          <CheckBox
            checked={false}
            style={{paddingLeft: 0, marginLeft: 0, marginTop: 0, paddingTop: 0}}
          />
          <Body>
            <Text
              style={{
                marginLeft: 15,
                textDecorationColor: 'red',
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
              }}>
              {item.fullname}
            </Text>
          </Body>
        </ListItem>
      );
    }
    return <List>{ChkBox}</List>;
  };

  const renderEmpty = () => {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          NO ONE ALREADY TO ASSIGN
        </Text>
      </View>
    );
  };

  const content = () => {
    if (loading == true) {
      return <SkeletonFakeList row={4} height={20} />;
    } else {
      return (
        <FlatList
          removeClippedSubviews={true}
          data={props.list}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty()}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={GlobalReducer.refresh}
              onRefresh={() => dispatch(setRefresh(true))}
            />
          }
          {...rest}
        />
      );
    }
  };

  return content();
};
