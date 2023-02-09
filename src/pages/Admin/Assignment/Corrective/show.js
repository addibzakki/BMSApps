import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, Alert} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {
  TopHeader,
  TextLineIndent,
  ButtonActionShow,
  ListAttachment,
  ListAssignment,
} from '../../../../component';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {cm_style, global_style} from './Styles';
import {CorrectiveAPIService} from '../../../../services';
import {
  setPicStatusCorrective,
  setRefresh,
  setLoading,
} from '../../../../redux';

const AdminHelpdeskShow = ({navigation}) => {
  console.log('On Page Show Ticket');
  const dispatch = useDispatch();
  const LoginReducer = useSelector(state => state.LoginReducer);
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const [image, setImage] = useState([]);
  const [dataSpv, setDataSpv] = useState([]);
  const [dataRespon, setDataRespon] = useState([]);
  const [dataEngineer, setDataEngineer] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // when refresh : true
    if (GlobalReducer.refresh === true) {
      getAllPIC();
    }
    // when focused : true
    const unsubscribe = navigation.addListener('focus', () => {
      getAllPIC();
    });
    return unsubscribe;
  }, [navigation, GlobalReducer.refresh === true]);

  // get all pic
  const getAllPIC = async () => {
    try {
      // Supervisor
      const params_supervisor = {
        ticket_no: CorrectiveReducer.ticket_no,
        eng_username: LoginReducer.form.profile.uid,
        eng_level: LoginReducer.form.profile.level,
      };
      const res_supervisor = await CorrectiveAPIService.getSupervisor(
        params_supervisor,
      );
      dispatch(
        setPicStatusCorrective(res_supervisor.data.user_pic.assignment_status),
      );
      setDataSpv(res_supervisor.data.user_pic);
      setDataEngineer(res_supervisor.data.engineer);

      // Engineer
      const res_engineer = await CorrectiveAPIService.getEngineer(
        CorrectiveReducer.ticket_no,
      );
      setDataRespon(res_engineer.data.ticket);
      // checkImageReference(res_engineer.data.attach);
      if (res_engineer.data.ticket['refs_ticket'] == null) {
        setImage([...res_engineer.data.attach]);
      } else {
        try {
          const res = await CorrectiveAPIService.getImageFromPreventive(
            res_engineer.data.ticket['refs_ticket'],
          );
          var temp = [];
          res.data.data.map(image => {
            temp.push(image.image_url);
          });
          setImage([...temp]);
        } catch (error) {
          console.log(error);
          Alert.alert('Error', error.message);
        }
      }
      // setImage([...res_engineer.data.attach]);
      dispatch(setRefresh(false));
      dispatch(setLoading(false));
    } catch (error) {
      Alert.alert('Error', error.message);
      dispatch(setRefresh(false));
      dispatch(setLoading(false));
      setLoadingData(false);
    }
  };

  return (
    <View style={global_style.page}>
      <Spinner
        visible={GlobalReducer.loading}
        textContent={'Processing...'}
        textStyle={{color: '#FFF'}}
        overlayColor={'rgba(0, 0, 0, 0.60)'}
      />
      <Spinner
        visible={loadingData}
        textContent={'Loading data...'}
        textStyle={{color: '#FFF'}}
        overlayColor={'rgba(0, 0, 0, 0.60)'}
      />
      <TopHeader
        title="Assignment"
        subTitle={'#' + CorrectiveReducer.ticket_no}
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={cm_style.subPage}>
        <ScrollView>
          <View>
            <View style={global_style.space(10)} />
            {dataRespon.ticket_by == 'T' ? (
              <TextLineIndent label="Tenant" value={dataRespon.company_name} />
            ) : (
              <TextLineIndent label="Entity" value={dataRespon.company_name} />
            )}
            {dataRespon.ticket_by == 'T' ? (
              <TextLineIndent label="Person" value={dataRespon.tenant_person} />
            ) : (
              <TextLineIndent
                label="Employee"
                value={dataRespon.tenant_person}
              />
            )}
            <TextLineIndent label="Status" value={dataRespon.status_name} />
            <TextLineIndent label="Form" value={dataRespon.form_desc} />
            {dataRespon.type_desc != null && (
              <TextLineIndent label="Type" value={dataRespon.type_desc} />
            )}
            {dataRespon.category_desc != null && (
              <TextLineIndent
                label="Category"
                value={dataRespon.category_desc}
              />
            )}
            <TextLineIndent
              label="Location"
              value={dataRespon.tenant_ticket_location}
            />
            <TextLineIndent
              label="Description"
              value={dataRespon.tenant_ticket_description}
            />
            <View style={global_style.space(15)} />
          </View>
          <View style={cm_style.sub_third_container}>
            <View>
              <Text style={cm_style.text_third_container}>
                <Icon type="FontAwesome" size={24} name="image" /> Attachment
              </Text>
            </View>
            <View>
              <ListAttachment list={image} />
            </View>
            <View style={global_style.space(30)} />
          </View>
          <View style={cm_style.sub_third_container}>
            <View>
              <Text style={cm_style.text_third_container}>
                <Ionicons
                  type="Ionicons"
                  size={24}
                  name="people-circle-outline"
                />{' '}
                Assignment
              </Text>
            </View>
            <View>
              <ListAssignment list={dataEngineer} navigation={navigation} />
            </View>
            <View style={global_style.space(5)} />
          </View>
        </ScrollView>
        <View style={global_style.space(50)} />
        <View>
          <ButtonActionShow
            data={dataRespon}
            data_spv={dataSpv}
            navigation={navigation}
          />
        </View>
      </View>
    </View>
  );
};

export default AdminHelpdeskShow;
