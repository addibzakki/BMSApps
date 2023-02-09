import React, {useContext, useEffect, useState} from 'react';
import {View, Alert, FlatList, RefreshControl, Text} from 'react-native';
import {
  TopHeader,
  ButtonActionFooter,
  SkeletonFakeList,
} from '../../../../component';
import {useDispatch, useSelector} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {CorrectiveAPIService} from '../../../../services';
import {global_style} from '../../../../styles';
import moment from 'moment';
import GlobalContext from '../../../../component/GlobalContext';
import {
  Badge,
  Content,
  Icon,
  ListItem,
  Right,
  Thumbnail,
  Left,
  Body,
} from 'native-base';
import {userAvatar} from '../../../../assets';
import {colorLogo} from '../../../../utils';
import {
  setRefresh,
  setRunIDCorrective,
  setStateDataCorrective,
  setTypeCorrective,
} from '../../../../redux';

const AdminHelpdeskActivity = ({navigation}) => {
  const dispatch = useDispatch();
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [listActivity, setListActivity] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const networkContext = useContext(GlobalContext);

  console.log(
    'In page list activity with status_id : ' +
      CorrectiveReducer.ticket_status_id +
      ' & status_tenant : ' +
      CorrectiveReducer.ticket_status_tenant,
  );

  useEffect(() => {
    getData();
  }, [navigation, networkContext.networkInfo, GlobalReducer.refresh == true]);

  const getData = async () => {
    setLoading(true);
    try {
      if (networkContext.networkInfo == true) {
        console.log('Network : Ok');
        const res = await CorrectiveAPIService.getListActivityCorrective(
          CorrectiveReducer.ticket_no,
        );
        setStatus(res.data.status);
        setListActivity(res.data.list);
        setLoading(false);
      } else {
        console.log('Network : Not Ok');
        var temp = [];
        db.transaction(txn => {
          txn.executeSql(
            'SELECT a.*, b.emp_name, b.emp_photo FROM cm_action_tmp a LEFT JOIN gl_user_tmp b ON a.engineering_username = b.username WHERE a.tenant_ticket_id = ? ORDER BY created_date DESC',
            [CorrectiveReducer.ticket_no],
            (txn, res) => {
              for (let i = 0; i < res.rows.length; ++i) {
                temp.push({
                  runID: res.rows.item(i)['runID'],
                  username: res.rows.item(i)['emp_name'],
                  engineering_username: res.rows.item(i)[
                    'engineering_username'
                  ],
                  description: res.rows.item(i)['description'],
                  time_taken:
                    moment(res.rows.item(i)['created_date']).format(
                      'YYYY-MM-DD',
                    ) +
                    ' ' +
                    res.rows.item(i)['time_taken'],
                  created_date: res.rows.item(i)['created_date'],
                  attachment: res.rows.item(i)['attachment'],
                  attachment_after: res.rows.item(i)['attachment_after'],
                  request_item: res.rows.item(i)['request_item'],
                  request_item_description: res.rows.item(i)[
                    'request_item_description'
                  ],
                  status_id: res.rows.item(i)['status_id'],
                  photo: res.rows.item(i)['emp_photo'],
                  confirm_item: res.rows.item(i)['confirm_item'],
                });
              }
              setListActivity(temp);
              if (res.rows.length > 0) {
                txn.executeSql(
                  'SELECT distinct status_id FROM cm_action_tmp WHERE tenant_ticket_id = ?',
                  [CorrectiveReducer.ticket_no],
                  (txn, res) => {
                    setStatus(res.rows.item(0)['status_id']);
                  },
                  error => {
                    console.log(
                      'error on insert table cm_action_tmp ' + error.message,
                    );
                    Alert.alert('error', 'Submit action recording failed');
                    setLoading(false);
                  },
                );
              } else {
                setStatus(1);
              }
            },
            error => {
              console.log(
                'error on select table cm_tenant_ticket_tmp ' + error.message,
              );
            },
          );
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log('Error', error);
    }
  };

  const renderEmpty = () => {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          NO ACTIVITY TO DO
        </Text>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    let type_form;

    if (item.request_item > 0) {
      if (
        CorrectiveReducer.ticket_status_id == '3' &&
        LoginReducer.form.profile.level == 'Supervisor' &&
        item.confirm_item == 0
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
                navigation.navigate('AdminHelpdeskForm');
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
  const ListContent = () => {
    if (loading == true) {
      return (
        <Content>
          <View style={{alignItems: 'center'}}>
            <SkeletonFakeList row={7} height={40} />
          </View>
        </Content>
      );
    } else {
      return (
        <Content>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={listActivity}
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
    }
  };

  return (
    <View style={global_style.page}>
      <Spinner
        visible={GlobalReducer.loading}
        textContent={'Processing...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title={CorrectiveReducer.ticket_no}
        subTitle="List Activity"
        onPress={() => navigation.replace('AdminHelpdeskShow')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={global_style.sub_page}>
        <View style={(global_style.content, {flex: 1})}>
          <ListContent />
          <ButtonActionFooter navigation={navigation} />
        </View>
      </View>
    </View>
  );
};

export default AdminHelpdeskActivity;
