import React, {useState, useEffect} from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TopHeader} from '../../../component';
import {colorLogo} from '../../../utils';
import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const widthScreen = Dimensions.get('window').width;
const numColumns = 3;
const AdminMeterDetail = ({navigation, route}) => {
  const [image, setImage] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      setLoading(true);
      // console.log(route.params.attachment)
      if (route.params.attachment !== null) {
        var tmp = [];
        route.params.attachment.split(';;').map(value => {
          tmp.push({filename: value});
        });
        setImage([...tmp]);
      }
      setLoading(false);
    }
    return () => {
      unmounted = true;
    };
  }, []);

  const HandleModalVisible = (value, file) => {
    setModalVisible(value);
    setModalImage(file);
  };

  const renderAttachment = ({item, index}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => HandleModalVisible(true, item.filename)}
        key={index}>
        <Image
          source={{
            uri:
              'https://mmpportal.mmproperty.com/img/bms/photo/' + item.filename,
          }}
          style={styles.image_size}
          resizeMethod="resize"
        />
      </TouchableWithoutFeedback>
    );
  };

  const renderEmpty = loading => {
    if (loading == true) {
      return (
        <SkeletonPlaceholder>
          <View style={{width: widthScreen, height: 250}} />
        </SkeletonPlaceholder>
      );
    } else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            PHOTO NOT AVAILABLE
          </Text>
        </View>
      );
    }
  };

  let lastReadHigh;
  let currReadHigh;

  if (route.params.last_read_high !== 0 && route.params.curr_read_high !== 0) {
    lastReadHigh = (
      <View style={styles.wrapper.sub_second_container}>
        <View style={{width: '40%'}}>
          <Text style={styles.utils.text_second_container}>
            <Icon type="FontAwesome" active name="dashboard" size={14} /> Last
            Read High
          </Text>
        </View>
        <View style={{width: '60%'}}>
          <Text style={styles.utils.text_sub_second_container}>
            : {route.params.last_read_high} {route.params.uom}
          </Text>
        </View>
      </View>
    );
    currReadHigh = (
      <View style={styles.wrapper.sub_second_container}>
        <View style={{width: '40%'}}>
          <Text style={styles.utils.text_second_container}>
            <Icon type="FontAwesome" active name="dashboard" size={14} />{' '}
            Current Read High
          </Text>
        </View>
        <View style={{width: '60%'}}>
          <Text style={styles.utils.text_sub_second_container}>
            : {route.params.curr_read_high} {route.params.uom}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper.page}>
      <TopHeader
        title="Meter History"
        subTitle="Detail"
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      <View style={styles.wrapper.subPage}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {}}>
          <View
            style={{
              flex: 1,
              paddingVertical: 30,
              backgroundColor: 'rgba(0,0,0,0.9)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{
                uri:
                  'https://mmpportal.mmproperty.com/img/bms/photo/' +
                  modalImage,
              }}
              style={{
                flex: 1,
                height: Dimensions.get('window').height / 3 - 12,
                width: '100%',
                marginBottom: 5,
                // transform: [{rotate: '90deg'}],
              }}
              resizeMode="contain"
              resizeMethod="resize"
            />
            <Text
              style={{
                color: '#ffffff',
                padding: 5,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#ffffff',
              }}
              onPress={() => setModalVisible(false)}>
              {' '}
              <Icon
                type="FontAwesome"
                active
                name="times"
                style={{
                  color: '#FFFFFF',
                  fontSize: 14,
                }}
              />{' '}
              Close
            </Text>
          </View>
        </Modal>
        <ScrollView>
          <View style={styles.wrapper.second_container}>
            <View style={styles.space(10)} />
            <View style={styles.wrapper.sub_second_container}>
              <View style={{width: '25%'}}>
                <Text style={styles.utils.text_second_container}>
                  <Icon
                    type="FontAwesome"
                    active
                    name="chevron-right"
                    size={14}
                  />{' '}
                  Debtor
                </Text>
              </View>
              <View style={{width: '75%'}}>
                <Text style={styles.utils.text_sub_second_container}>
                  : {route.params.debtor_name}
                </Text>
              </View>
            </View>
            <View style={styles.wrapper.sub_second_container}>
              <View style={{width: '25%'}}>
                <Text style={styles.utils.text_second_container}>
                  <Icon
                    type="FontAwesome"
                    active
                    name="chevron-right"
                    size={14}
                  />{' '}
                  Meter ID
                </Text>
              </View>
              <View style={{width: '75%'}}>
                <Text style={styles.utils.text_sub_second_container}>
                  : {route.params.meter_id}
                </Text>
              </View>
            </View>
            <View style={styles.wrapper.sub_second_container}>
              <View style={{width: '25%'}}>
                <Text style={styles.utils.text_second_container}>
                  <Icon
                    type="FontAwesome"
                    active
                    name="chevron-right"
                    size={14}
                  />{' '}
                  Type
                </Text>
              </View>
              <View style={{width: '75%'}}>
                <Text style={styles.utils.text_sub_second_container}>
                  : {route.params.type_desc}
                </Text>
              </View>
            </View>
            <View style={styles.space(10)} />
            <View
              style={{
                backgroundColor: colorLogo.color2,
                flex: 1,
                marginHorizontal: 15,
                borderRadius: 15,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>
                METER READING
              </Text>
            </View>
            <View style={styles.space(15)} />
            <View style={styles.wrapper.sub_second_container}>
              <View style={{width: '40%'}}>
                <Text style={styles.utils.text_second_container}>
                  <Icon type="FontAwesome" active name="calendar" size={14} />{' '}
                  Last Date
                </Text>
              </View>
              <View style={{width: '60%'}}>
                <Text style={styles.utils.text_sub_second_container}>
                  : {moment(route.params.last_read_date).format('DD MMMM YYYY')}
                </Text>
              </View>
            </View>
            <View style={styles.wrapper.sub_second_container}>
              <View style={{width: '40%'}}>
                <Text style={styles.utils.text_second_container}>
                  <Icon type="FontAwesome" active name="dashboard" size={14} />{' '}
                  Last Read
                </Text>
              </View>
              <View style={{width: '60%'}}>
                <Text style={styles.utils.text_sub_second_container}>
                  : {route.params.last_read} {route.params.uom}
                </Text>
              </View>
            </View>

            {lastReadHigh}

            <View style={styles.space(5)} />
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
                marginHorizontal: 20,
              }}
            />
            <View style={styles.space(10)} />
            <View style={styles.wrapper.sub_second_container}>
              <View style={{width: '40%'}}>
                <Text style={styles.utils.text_second_container}>
                  <Icon type="FontAwesome" active name="calendar" size={14} />{' '}
                  Current Date
                </Text>
              </View>
              <View style={{width: '60%'}}>
                <Text style={styles.utils.text_sub_second_container}>
                  : {moment(route.params.curr_read_date).format('DD MMMM YYYY')}
                </Text>
              </View>
            </View>
            <View style={styles.wrapper.sub_second_container}>
              <View style={{width: '40%'}}>
                <Text style={styles.utils.text_second_container}>
                  <Icon type="FontAwesome" active name="dashboard" size={14} />{' '}
                  Current Read
                </Text>
              </View>
              <View style={{width: '60%'}}>
                <Text style={styles.utils.text_sub_second_container}>
                  : {route.params.curr_read} {route.params.uom}
                </Text>
              </View>
            </View>

            {currReadHigh}

            <View style={styles.space(10)} />
            <View
              style={{
                backgroundColor: colorLogo.color2,
                flex: 1,
                marginHorizontal: 15,
                borderRadius: 15,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>
                PHOTO
              </Text>
            </View>
            <View style={styles.space(10)} />
            <View style={styles.wrapper.sub_third_container}>
              <View style={styles.wrapper.image_container}>
                <FlatList
                  removeClippedSubviews={true}
                  data={image}
                  renderItem={renderAttachment}
                  ListEmptyComponent={renderEmpty(loading)}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={numColumns}
                />
              </View>
            </View>

            <View style={styles.space(10)} />
            <View
              style={{
                backgroundColor: colorLogo.color2,
                flex: 1,
                marginHorizontal: 15,
                borderRadius: 15,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 18, color: 'white'}}>
                SIGN
              </Text>
            </View>
            <View style={styles.space(10)} />
            <View
              style={
                (styles.wrapper.sub_third_container, {alignItems: 'center'})
              }>
              <Image
                resizeMode={'contain'}
                style={{width: wp('90%'), height: hp('20%')}}
                source={{uri: route.params.signature}}
              />

              <Text style={{textTransform: 'uppercase', fontSize: 16}}>
                Signed By
              </Text>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                ( {route.params.tenant_name} )
              </Text>
            </View>
            <View style={styles.space(10)} />
          </View>
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
    second_container: {
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    subPage: {
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: 'white',
    },
    sub_second_container: {
      marginHorizontal: 20,
      flexDirection: 'row',
      marginBottom: 10,
    },
    sub_third_container: {
      marginHorizontal: 15,
    },
    image_container: {
      paddingTop: 10,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    menu: {
      borderRadius: 20,
      marginHorizontal: 10,
    },
  },
  utils: {
    text: {
      fontSize: 18,
    },
    text_second_container: {
      fontSize: 18,
    },
    text_sub_second_container: {
      fontSize: 18,
      flex: 1,
      flexWrap: 'wrap',
      fontWeight: 'bold',
      textAlign: 'justify',
    },
    text_third_container: {
      color: colorLogo.color3,
      fontSize: 20,
      fontWeight: 'bold',
    },
  },
  image_size: {
    flex: 1,
    height: Dimensions.get('window').height / 4 - 12,
    width: Dimensions.get('window').width / 2 - 4,
    margin: 1,
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default AdminMeterDetail;
