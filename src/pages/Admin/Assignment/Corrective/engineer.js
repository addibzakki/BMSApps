import React, {useEffect, useState} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {Content, Button, Text, Footer, FooterTab} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {
  TopHeader,
  ListEngineer,
  sendNotificationOneSignal,
} from '../../../../component';
import {colorLogo} from '../../../../utils';
import {CorrectiveAPIService} from '../../../../services';
import {setListEngineerCorrective, setRefresh} from '../../../../redux';

const AdminHelpdeskEngineer = ({navigation}) => {
  console.log('In Page List Engineer');
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // when refresh : true
    if (GlobalReducer.refresh == true) {
      getData();
    }
    // when focused : true
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation, GlobalReducer.refresh == true]);

  const getData = async () => {
    try {
      const params = {
        page: 'list-engineer',
        ticket_no: CorrectiveReducer.ticket_no,
        eng_username: LoginReducer.form.profile.uid,
        eng_level: LoginReducer.form.profile.level,
      };

      const res = await CorrectiveAPIService.getListEngineerCorrective(params);
      if (typeof res.data.engineer != 'undefined') {
        dispatch(setListEngineerCorrective(res.data.engineer));
      }
      dispatch(setRefresh(false));
    } catch (error) {
      Alert.alert('Error', error);
      dispatch(setRefresh(false));
    }
  };

  const HandleConfirmSubmit = () => {
    let count = 0;
    for (var i = 0; i < CorrectiveReducer.list_engineer.length; i++) {
      if (CorrectiveReducer.list_engineer[i].isChecked == 'true') {
        count++;
      }
    }
    if (count < 1) {
      Alert.alert(
        'Error',
        'Sorry, Please choose one or more of your engineers',
      );
    } else {
      HandleSubmitAssignment();
    }
  };

  const HandleSubmitAssignment = async () => {
    try {
      const params = {
        ticket_type: CorrectiveReducer.ticket_type,
        ticket_category: CorrectiveReducer.ticket_category,
        type: CorrectiveReducer.type,
        ticket_priority: CorrectiveReducer.ticket_priority,
        ticket_no: CorrectiveReducer.ticket_no,
        eng_username: LoginReducer.form.profile.uid,
        eng_level: LoginReducer.form.profile.level,
        data: CorrectiveReducer.list_engineer,
      };
      console.log(params);
      const res = await CorrectiveAPIService.submitAssignmentCorrective(params);

      if (res.data.message == 'success') {
        setRefreshing(false);
        sendNotificationOneSignal(
          'Assignment : ',
          'Hey, You have assignment from ' +
            LoginReducer.form.profile.name +
            ' with ticket number : ' +
            CorrectiveReducer.ticket_no,
          res.data.player_ids,
        );
        navigation.replace('AdminHelpdeskShow');
      }
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  return (
    <View style={styles.wrapper.page}>
      <Spinner
        visible={refreshing}
        textContent={'Submit...'}
        textStyle={{color: '#FFF'}}
        overlayColor={'rgba(0, 0, 0, 0.60)'}
      />
      <TopHeader
        title="Assignment"
        subTitle={
          CorrectiveReducer.type != 'transfer' ? 'List Assigned' : 'Transfer To'
        }
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />

      <View style={styles.wrapper.subPage}>
        <ScrollView>
          <View style={styles.wrapper.menu}>
            <Content>
              <ListEngineer
                list={CorrectiveReducer.list_engineer}
                navigation={navigation}
                level={LoginReducer.form.profile.level}
                type={CorrectiveReducer.type}
              />
            </Content>
          </View>
        </ScrollView>
        <View style={styles.space(15)} />

        <View style={{flex: 1}}>
          <View
            style={{
              borderWidth: 0.5,
              position: 'absolute',
              bottom: 0,
              width: '100%',
              alignSelf: 'flex-end',
            }}>
            {CorrectiveReducer.type != 'transfer' && (
              <Footer>
                <FooterTab>
                  <Button info full onPress={() => HandleConfirmSubmit()}>
                    <Text
                      style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}}>
                      Submit
                    </Text>
                  </Button>
                </FooterTab>
              </Footer>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: colorLogo.color4,
    },
    subPage: {
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: 'white',
    },
    top_container: {
      backgroundColor: colorLogo.color2,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    menu: {
      borderRadius: 20,
      marginHorizontal: 10,
    },
    title: {
      alignItems: 'center',
      marginVertical: 10,
    },
    titleText: {
      fontSize: 19,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  },
  utils: {
    text: {
      fontSize: 16,
    },
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default AdminHelpdeskEngineer;
