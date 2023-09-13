import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  InputForm,
  ListAttachment,
  TopHeader,
} from '../../component';
import {colorLogo} from '../../utils';
import Spinner from 'react-native-loading-spinner-overlay';
import { ActionButtonAttachment, ActionButtonAttachmentMultipleShow } from '../Admin/ActionButton';
import PettyLAPIService from '../../services/Petty/PettyAPIService';

const PettyShowCapture = ({route, navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [fileList, setFileList] = useState([]);

  
  console.log(route.params);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, []);

  const getData = async () => {
    try {
      // const params = {
      //   entity_project: route.params.entity_project,
      //   project_no: route.params.project_no,
      //   bank_cd: route.params.bank_cd,
      //   doc_no: route.params.doc_no
      // };
      const res = await PettyLAPIService.getDetailByID(
        route.params.id,
      );

      console.log(res.data.data.attachment_file);

      setAmount(res.data.data.amount);
      setDescription(res.data.data.descs);
      setFileList(res.data.data.attachment_file);

      // setDataHeader(res.data.header);
      // setDataDetail(res.data.data);
      // console.log(dataHeader);
      // console.log(dataDetail);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const ButtonAlert = () =>
    Alert.alert('Attention', 'Are you sure to leave this form?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => navigation.navigate('AdminDashboard')},
    ]);
  return (
    <View style={styles.wrapper.page}>
      <Spinner
        visible={loading}
        textContent={'Submiting Capture Settlement...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title={'Capture Settlement'}
        subTitle={'#' + route.params.doc_no}
        onPress={() => navigation.replace('PettyDetail', route.params)}
        onPressHome={() => ButtonAlert()}
      />
      
      <View style={styles.wrapper.subPage}>
        <ScrollView>
          <View style={styles.space(10)} />
          <View style={styles.wrapper.content}>
            <InputForm
              placeholder="Amount"
              keyboardType="number-pad"
              value={amount}
              editable={false}
            />
            <InputForm
              placeholder="Description"
              multiline={true}
              value={description}
              editable={false}
            />
            <ListAttachment list={fileList} />
            <View style={styles.space(15)} />
          </View>
          <View style={styles.space(20)} />
        </ScrollView>
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
    content: {
      borderRadius: 20,
      marginHorizontal: 15,
    },
    subPage: {
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

export default PettyShowCapture;
