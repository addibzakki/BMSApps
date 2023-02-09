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
            backgroundColor: item.status_color.trim(),
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
              borderColor: item.status_color.trim(),
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
    console.log('refresh');
    dispatch(setRefresh(true));
  };

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const renderEmpty = () => {
    if (loading == true) {
      return <SkeletonFakeList row={4} height={110} />;
    } else {
      return (
        <View style={global_style.container_empty}>
          <Text style={global_style.text_empty}>NO LISTING TICKET</Text>
        </View>
      );
    }
  };

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
    if (loading == true) {
      return <SkeletonFakeList row={3} height={50} />;
    } else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            NO PRIORITY SETUP
          </Text>
        </View>
      );
    }
  };

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
    props.navigation.navigate('AdminHelpdeskCategory');
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
    if (loading == true) {
      return <SkeletonFakeList row={2} height={50} />;
    } else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>NO TYPE SETUP</Text>
        </View>
      );
    }
  };

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
    if (loading == true) {
      return <SkeletonFakeList row={4} height={50} />;
    } else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            NO CATEGORY SETUP
          </Text>
        </View>
      );
    }
  };

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

  const handleGoTo = item => {
    // dispatch(setTicketCategoryCorrective(item.value));
    // props.navigation.navigate('AdminHelpdeskEngineer');
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
      Alert.alert('Error', error.message);
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <View>
        <ListItem
          // onPress={() => handleGoTo(item)}
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
    if (loading == true) {
      return <SkeletonFakeList row={4} height={50} />;
    } else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            NO ONE ALREADY TO ASSIGN
          </Text>
        </View>
      );
    }
  };

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
      Alert.alert('Error', error.message);
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
      Alert.alert('Error', error.message);
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
    if (loading == true) {
      return <SkeletonFakeList row={4} height={20} />;
    } else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            NO ONE ALREADY TO ASSIGN
          </Text>
        </View>
      );
    }
  };

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
};

export const ListActivity = (props, ...rest) => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(true);
  const networkContext = useContext(GlobalContext);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const renderHiddenItem = (data, rowMap) => (
    <View
      style={{
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
      }}>
      <TouchableOpacity
        style={[
          {
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: 75,
          },
          {
            borderTopRightRadius: 25,
            borderBottomRightRadius: 25,
            backgroundColor: 'red',
            right: 0,
          },
        ]}
        onPress={() => deleteRow(rowMap, data.item.key, data.item.runID)}>
        <Icon
          type="FontAwesome"
          name="trash"
          style={{
            fontSize: 22,
            color: '#FFF',
          }}
        />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => {
    if (loading == true) {
      return (
        <View style={{alignItems: 'center'}}>
          <SkeletonFakeList row={7} height={40} />
        </View>
      );
    } else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            NO ACTIVITY TO DO
          </Text>
        </View>
      );
    }
  };

  const renderItem = ({item, index}) => {
    console.log('Ticket Status ID : ' + CorrectiveReducer.ticket_status_id);
    let type_form;

    if (item.request_item > 0) {
      if (
        CorrectiveReducer.ticket_status_id == '3' &&
        LoginReducer.form.profile.level == 'Supervisor' &&
        item.confirm_item == 0
        // CorrectiveReducer.ticket_status_tenant == 3
      ) {
        type_form = 'confirm-item';
      } else if (
        CorrectiveReducer.ticket_status_id == '12' &&
        LoginReducer.form.profile.level == 'Supervisor' &&
        item.confirm_item == 0
      ) {
        type_form = 'confirm-available-item';
      } else if (
        CorrectiveReducer.ticket_status_id == '3' &&
        LoginReducer.form.profile.level == 'Supervisor' &&
        item.confirm_item == 1
      ) {
        type_form = 'change-status';
      } else if (
        LoginReducer.form.profile.level == 'Engineer' &&
        CorrectiveReducer.pic_status != 'A'
      ) {
        type_form = 'show';
      } else {
        if (item.confirm_item == 1) {
          type_form = 'modify-item-fix';
        } else {
          type_form = 'modify';
        }
      }
    } else {
      if (CorrectiveReducer.ticket_status_id >= 5) {
        type_form = 'show';
      } else {
        type_form = 'modify';
      }
    }

    return (
      <View>
        <View>
          <ListItem
            key={index}
            avatar
            onPress={() => {
              if (networkContext.networkInfo == false) {
                Alert.alert(
                  'Attention',
                  'Sorry, please use a good network to access this feature',
                );
              } else {
                dispatch(setTypeCorrective(type_form));
                dispatch(setRunIDCorrective(item.runID));
                dispatch(setStateDataCorrective(item));
                props.navigation.navigate('AdminHelpdeskForm');
              }
            }}
            style={{
              backgroundColor: 'white',
              marginLeft: 0,
              paddingLeft: 17,
              paddingTop: 5,
              paddingBottom: 10,
            }}>
            <Left>
              <Thumbnail source={userAvatar} resizeMethod="resize" />
            </Left>
            <Body style={{borderBottomWidth: 0}}>
              <Text style={{textTransform: 'capitalize'}}>
                <Icon type="Ionicons" name="people" style={{fontSize: 14}} />{' '}
                {item.username}
              </Text>
              <Text
                style={{
                  textAlign: 'justify',
                  borderWidth: 1,
                  borderRadius: 5,
                  flex: 1,
                  marginVertical: 5,
                  padding: 5,
                  borderColor: colorLogo.color5,
                }}
                note>
                {item.description}
              </Text>
              {item.request_item > 0 && (
                <Badge warning>
                  <Text>Have a request for an item</Text>
                </Badge>
              )}
            </Body>
            <Right style={{borderBottomWidth: 0}}>
              <Text note>{moment(item.created_date).format('MM/DD/YYYY')}</Text>
              <Text note>{moment(item.time_taken).format('HH:mm')}</Text>
            </Right>
          </ListItem>
        </View>
      </View>
    );
  };

  const onRefresh = () => {
    dispatch(setRefresh(true));
  };

  // const ignore_status = ['6', '5'];
  // if (!ignore_status.includes(props.status)) {
  //   return (
  //     <Content>
  //       <SwipeListView
  //         data={props.list}
  //         renderItem={renderItem}
  //         renderHiddenItem={renderHiddenItem}
  //         disableRightSwipe={true}
  //         rightOpenValue={-75}
  //         ListEmptyComponent={renderEmpty()}
  //         keyExtractor={(item, index) => index.toString()}
  //         refreshControl={
  //           <RefreshControl
  //             onRefresh={() => onRefresh()}
  //             refreshing={GlobalReducer.refresh}
  //           />
  //         }
  //       />
  //     </Content>
  //   );
  // } else {
  return (
    <Content>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={props.list}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty()}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            onRefresh={() => onRefresh()}
            refreshing={GlobalReducer.refresh}
          />
        }
      />
    </Content>
  );
  // }
};
