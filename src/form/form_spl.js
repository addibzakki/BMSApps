import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert, Text, Modal, FlatList} from 'react-native';
import {Button, InputForm, InputUntil} from '../component';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {Body, CheckBox, Content, ListItem} from 'native-base';
import {global_style} from '../styles';

export const FormRequestSPL = ({navigation}) => {
  const [tenantName, setTenantName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [list, setList] = useState([]);
  const LoginReducer = useSelector(state => state.LoginReducer);

  const getData = () => {
    axios
      .post('https://mynet.mmproperty.com/api/get_ticket_spl', {
        users: LoginReducer.form.profile,
      })
      .then(function(response) {
        setList(response.data.list);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const handleConfirmRequest = () => {
    Alert.alert('Confirmation!', 'Are you sure want to request overtime?', [
      {
        text: 'No',
        onPress: () => console.log('cancel'),
        style: 'cancel',
      },
      {text: 'Yes, Sure!', onPress: () => handleRequestSPL()},
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
      console.log(list);
    });
    return () => {
      unsubscribe;
    };
  }, []);

  const handleRequestSPL = () => {
    console.log('post SPL');
  };

  const renderItem = ({item, index}) => {
    console.log(item.tenant_ticket_id);
    return (
      <View>
        <Text>{item.tenant_ticket_id}</Text>
        {/* <ListItem
          // onPress={() => chkbox_check(item, index)}
          style={{paddingLeft: 0, marginLeft: 0}}>
          <CheckBox
            // onPress={() => chkbox_check(item, index)}
            checked={list[index].isChecked == 'true' ? true : false}
            style={{paddingLeft: 0, marginLeft: 0, marginTop: 0, paddingTop: 0}}
          />
          <Body>
            <Text style={{marginLeft: 15}}>{item.tenant_ticket_id}</Text>
          </Body>
        </ListItem> */}
      </View>
    );
  };

  const handleTicketReference = () => {
    // getData();
    setModalVisible(true);
  };

  return (
    <View style={styles.wrapper.subPage}>
      <Modal animationType={'slide'} transparent={false} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View
            style={{
              paddingHorizontal: 20,
              alignItems: 'center',
            }}>
            <Content>
              <FlatList
                data={list}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </Content>
          </View>

          <View style={global_style.space(20)} />
          <View style={{paddingHorizontal: 20}}>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <ScrollView>
        <View style={styles.wrapper.content}>
          <InputForm
            placeholder="Name"
            value={LoginReducer.form.profile.name}
            editable={false}
          />
          <InputForm placeholder="Date" value={tenantName} editable={false} />
          <InputForm
            placeholder="Location"
            value={tenantName}
            editable={false}
          />
          <InputUntil title="Work Schedule" />
          <InputUntil title="Overtime Projection" />
        </View>
        <View style={styles.space(20)} />
        <View style={{paddingHorizontal: 20}}>
          <Button
            title="Ticket Reference"
            onPress={() => handleTicketReference()}
          />
          <View style={styles.space(5)} />
          <Button
            title="Submit Request"
            onPress={() => handleConfirmRequest()}
          />
        </View>
        <View style={styles.space(20)} />
      </ScrollView>
    </View>
  );
};

const styles = {
  wrapper: {
    content: {
      borderRadius: 20,
      marginHorizontal: 15,
    },
    subPage: {
      paddingVertical: 10,
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: 'white',
    },
  },
  modal: {
    backgroundColor: 'white',
    margin: 0,
    alignItems: undefined,
    justifyContent: undefined,
  },
  space: value => {
    return {
      height: value,
    };
  },
};
