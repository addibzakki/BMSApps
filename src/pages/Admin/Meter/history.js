import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import {ListItem} from 'native-base';
import {TopHeader, SelectSearch} from '../../../component';
import {colorLogo} from '../../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setInfoSummary} from '../Action';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

const widthScreen = Dimensions.get('window').width;
const AdminMeterHistory = ({navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const MeterReducer = useSelector(state => state.MeterReducer);
  const dispatch = useDispatch();
  const [active, setActive] = useState('EL');
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showListing, setShowListing] = useState(false);
  const [tenant, setTenant] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [listTenant, setListTenant] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [modalReading, setModalReading] = useState(false);
  const [listReading, setListReading] = useState([]);
  const [modalUnreading, setModalUnreading] = useState(false);
  const [listUnreading, setListUnreading] = useState([]);

  const handleSetTenant = itemValue => {
    const index = listTenant.findIndex(item => item.id === itemValue);
    if (index >= 0) {
      setShowListing(true);
      setTenant(itemValue);
      setLoading(true);
      getInfo(itemValue);
      setTenantName(listTenant[index]['label']);
    } else {
      dispatch(setInfoSummary([]));
    }
  };

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      getData();
    }
    return () => {
      unmounted = true;
    };
  }, []);

  const getData = () => {
    const url = 'https://mmpportal.mmproperty.com/api/get_tenant/list';
    axios
      .get(url)
      .then(function(response) {
        setListTenant([...response.data]);
        setDisable(false);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const getInfo = businessID => {
    let user;
    if (
      LoginReducer.form.profile.level == 'Admin' ||
      LoginReducer.form.profile.level == 'Supervisor'
    ) {
      user = 'All';
    } else {
      user = LoginReducer.form.profile.mail;
    }
    const url =
      'https://mmpportal.mmproperty.com/api/get_summary/' +
      businessID +
      '/' +
      user;
    axios
      .get(url)
      .then(function(response) {
        dispatch(setInfoSummary(response.data));
        setLoading(false);
        setDisable(false);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const renderReading = ({item, index}) => {
    return (
      <ListItem key={index} noIndent>
        <View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '30%'}}>
              <Text>Meter ID</Text>
            </View>
            <View style={{width: '70%'}}>
              <Text style={{fontWeight: 'bold'}}>: {item.meter_id}</Text>
            </View>
          </View>
          <View style={styles.space(5)} />
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '30%'}}>
              <Text>Read Date</Text>
            </View>
            <View style={{width: '70%'}}>
              <Text>
                : {moment(item.curr_read_date).format('DD MMMM YYYY')}
              </Text>
            </View>
          </View>
          <View style={styles.space(5)} />
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '30%'}}>
              <Text>Read By</Text>
            </View>
            <View style={{width: '70%'}}>
              <Text>: {item.read_by}</Text>
            </View>
          </View>
        </View>
      </ListItem>
    );
  };

  const renderUnreading = ({item, index}) => {
    return (
      <ListItem key={index} noIndent>
        <View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '30%'}}>
              <Text>Meter ID</Text>
            </View>
            <View style={{width: '70%'}}>
              <Text style={{fontWeight: 'bold'}}>: {item.meter_id}</Text>
            </View>
          </View>
          <View style={styles.space(5)} />
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '30%'}}>
              <Text>Ref No.</Text>
            </View>
            <View style={{width: '70%'}}>
              <Text>: {item.ref_no}</Text>
            </View>
          </View>
        </View>
      </ListItem>
    );
  };

  const getReading = type => {
    setModalReading(true);
    const url =
      'https://mmpportal.mmproperty.com/api/get_reading/' + type + '/' + tenant;
    axios
      .get(url)
      .then(function(response) {
        setListReading([...response.data]);
        setLoading(false);
      })
      .catch(function(error) {
        console.log(error);
        setLoading(false);
      });
  };

  const getUnreading = type => {
    setModalUnreading(true);
    const url =
      'https://mmpportal.mmproperty.com/api/get_unreading/' +
      type +
      '/' +
      tenant;
    axios
      .get(url)
      .then(function(response) {
        setListUnreading([...response.data]);
        setLoading(false);
      })
      .catch(function(error) {
        console.log(error);
        setLoading(false);
      });
  };

  const renderEmpty = loading => {
    if (loading == true) {
      var fakeStatus = [];
      for (let i = 0; i < 2; i++) {
        fakeStatus.push(
          <View key={i} style={{flex: 1, alignItems: 'center', margin: 5}}>
            <View
              style={{width: widthScreen - 20, height: 40, marginBottom: 2}}
            />
            <View
              style={{width: widthScreen - 20, height: 40, marginBottom: 2}}
            />
            <View
              style={{width: widthScreen - 20, height: 50, marginBottom: 2}}
            />
          </View>,
        );
      }
      return <SkeletonPlaceholder>{fakeStatus}</SkeletonPlaceholder>;
    } else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            DATA NOT AVAILABLE
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.wrapper.page}>
      <TopHeader
        title="Meter History"
        onPress={() => navigation.navigate('AdminMeter')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.wrapper.subPage}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
            // paddingVertical: 10,
            paddingBottom: 10,
          }}>
          <SelectSearch
            listMode="MODAL"
            modalProps={{
              animationType: 'Slide',
            }}
            searchable={true}
            open={open}
            value={value}
            items={listTenant}
            setOpen={setOpen}
            setValue={setValue}
            onChangeValue={handleSetTenant}
            itemSeparator={true}
          />
        </View>
        <View style={styles.space(10)} />
        <View style={styles.wrapper.content}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setActive('EL');
              }}
              style={{
                backgroundColor: active === 'EL' ? 'white' : colorLogo.color4,
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 15,
                borderTopLeftRadius: 15,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  color: active === 'EL' ? 'black' : 'white',
                }}>
                <MaterialCommunityIcons name="flash" size={16} />
                Electric
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setActive('WT');
              }}
              style={{
                backgroundColor: active === 'WT' ? 'white' : colorLogo.color4,
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 15,
                borderTopRightRadius: 15,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  color: active === 'WT' ? 'black' : 'white',
                }}>
                <MaterialCommunityIcons name="water" size={16} />
                Water
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              paddingVertical: 20,
              paddingHorizontal: 15,
            }}>
            <View>
              {/* <View style={{flexDirection: 'row'}}>
                <View style={{width: '30%'}}>
                  <Text style={{fontSize: 14}}>Total Reading</Text>
                </View>
                <View style={{width: '70%'}}>
                  <Text style={{fontSize: 14}}>
                    :{' '}
                    {active === 'EL'
                      ? MeterReducer.summary.total_reading_el
                      : MeterReducer.summary.total_reading_wt}
                  </Text>
                </View>
              </View> */}
              <View style={styles.space(10)} />
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '30%'}}>
                  <TouchableOpacity onPress={() => getReading(active)}>
                    <Text style={{fontSize: 14}}>Reading</Text>
                  </TouchableOpacity>
                </View>
                <View style={{width: '70%'}}>
                  <Text style={{fontSize: 14}}>
                    :{' '}
                    {active === 'EL'
                      ? MeterReducer.summary.reading_el
                      : MeterReducer.summary.reading_wt}
                  </Text>
                </View>
              </View>
              <View style={styles.space(10)} />
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '30%'}}>
                  <TouchableOpacity onPress={() => getUnreading(active)}>
                    <Text style={{fontSize: 14}}>Unreading</Text>
                  </TouchableOpacity>
                </View>
                <View style={{width: '70%'}}>
                  <Text style={{fontSize: 14}}>
                    :{' '}
                    {active === 'EL'
                      ? MeterReducer.summary.unreading_el
                      : MeterReducer.summary.unreading_wt}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.space(25)} />
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {showListing && (
                <TouchableOpacity
                  style={{
                    backgroundColor: colorLogo.color2,
                    width: wp('40%'),
                    borderRadius: 15,
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  disabled={disable}
                  onPress={() =>
                    navigation.navigate('AdminMeterListHistory', {
                      tenant: tenant,
                      type: active,
                      tenant_name: tenantName,
                      read_level: LoginReducer.form.profile.level,
                      read_by: LoginReducer.form.profile.uid,
                    })
                  }>
                  <Text
                    style={{
                      color: 'white',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                    }}>
                    <MaterialCommunityIcons
                      name="format-list-bulleted"
                      size={16}
                    />{' '}
                    Show History
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {loading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" animating={true} color={'#000'} />
            </View>
          )}
        </View>
      </View>
      <Modal animationType="slide" transparent={true} visible={modalReading}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>.:: READING METER ::.</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={listReading}
              renderItem={renderReading}
              ListEmptyComponent={renderEmpty(loading)}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.space(10)} />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalReading(!modalReading)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={modalUnreading}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>.:: UNREADING METER ::.</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={listUnreading}
              renderItem={renderUnreading}
              ListEmptyComponent={renderEmpty(loading)}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.space(10)} />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalUnreading(!modalUnreading)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      // backgroundColor: 'white',
      backgroundColor: colorLogo.color4,
    },
    subPage: {
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: 'white',
      paddingHorizontal: 15,
    },
    menu: {
      flex: 1,
      borderRadius: 20,
      marginHorizontal: 15,
    },
    content: {
      borderWidth: 1,
      borderRadius: 15,
      borderColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
    },
  },
  modal: {
    backgroundColor: 'white',
    alignItems: undefined,
    justifyContent: undefined,
  },
  utils: {
    text: {
      fontSize: 16,
    },
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(180,180,180,0.7)',
    borderRadius: 15,
  },
  text: {
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: colorLogo.color3,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
  },
  buttonClose: {
    backgroundColor: colorLogo.color1,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default AdminMeterHistory;
