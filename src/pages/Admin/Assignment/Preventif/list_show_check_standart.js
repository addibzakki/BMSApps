import React, {useEffect, useState} from 'react';
import {View, Alert, FlatList, RefreshControl, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {
  SkeletonFakeList,
  TextLineIndentLight,
  TopHeader,
} from '../../../../component';
import {global_style} from '../../../../styles';
import Spinner from 'react-native-loading-spinner-overlay';
import {colorButton, colorLogo} from '../../../../utils';
import {Body, Left, ListItem} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {addPhoto} from '../../../../assets';
import {PreventiveAPIService} from '../../../../services';

const AdminPreventifListShowCheckStandart = ({navigation}) => {
  console.log('in page show list preventif');
  const PreventifReducer = useSelector(state => state.PreventifReducer);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    try {
      const res = await PreventiveAPIService.getAllCheckStandart(
        PreventifReducer['checkstandart_id'],
      );
      setList([...res.data.data]);
      setRefresh(false);
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error);
      setRefresh(false);
    }
  };

  const renderItem = ({item, index}) => {
    let background_color;
    if (
      item.required == 0 &&
      (item.image_required == 0 || item.video_required == 0)
    ) {
      background_color = colorButton.submit;
    } else if (
      item.required == 1 &&
      item.image_required == 0 &&
      item.video_required == 0
    ) {
      background_color = colorButton.transfer;
    } else {
      background_color = colorButton.cancel;
    }
    return (
      <ListItem
        style={{
          borderWidth: 1,
          marginLeft: 0,
          borderRadius: 10,
          marginBottom: 5,
        }}
        avatar>
        <Left
          style={{
            backgroundColor: background_color,
            height: '100%',
            alignItems: 'center',
            paddingTop: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
          <View>
            <Icon
              active
              name="ios-clipboard-outline"
              style={{fontSize: 18, paddingHorizontal: 5, fontWeight: 'bold'}}
              color="white"
            />
          </View>
        </Left>
        <Body>
          <View style={{flexWrap: 'wrap'}}>
            <TextLineIndentLight label="Point" value={item.task_detail.name} />
            <TextLineIndentLight
              label="Desc"
              value={item.task_detail.description}
            />
            <View
              style={{
                borderWidth: 0.5,
                marginVertical: 5,
                borderColor: background_color,
              }}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  textAlign: 'justify',
                  width: '20%',
                  flexWrap: 'wrap-reverse',
                }}>
                Photo
              </Text>
              <Text
                style={{
                  textAlign: 'justify',
                  width: '1%',
                  flexWrap: 'wrap-reverse',
                }}>
                :
              </Text>
              <View style={{marginLeft: 3, width: '75%'}}>
                <View style={{width: '15%', justifyContent: 'center'}}>
                  <Image
                    source={
                      item.image['link'] == null
                        ? addPhoto
                        : {uri: item.image['link']}
                    }
                    style={
                      item.image['link'] == null
                        ? {width: 30, height: 30, opacity: 0.3}
                        : styles.solid_image
                    }
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: background_color,
            }}
          />
          <TextLineIndentLight label="Status" value={item.status.status_name} />
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 5,
              borderColor: background_color,
            }}
          />
          <View style={{flexWrap: 'wrap'}}>
            <TextLineIndentLight label="Remarks" value={item.remark} />
          </View>
        </Body>
      </ListItem>
    );
  };

  const onRefresh = () => {
    setRefresh(true);
    getData();
  };

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const renderEmpty = () => {
    if (loading == true) {
      return <SkeletonFakeList row={8} height={110} />;
    } else {
      return (
        <View style={global_style.container_empty}>
          <Text style={global_style.text_empty}>NO DATA HISTORY</Text>
        </View>
      );
    }
  };

  return (
    <View style={global_style.page}>
      <TopHeader
        title="Show Preventive"
        subTitle="Check Standart Preventive"
        onPress={() => navigation.goBack()}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />

      <View style={global_style.sub_page}>
        <View style={global_style.content}>
          <View>
            <Spinner
              visible={processing}
              textContent={'Processing...'}
              textStyle={{color: '#FFF'}}
              overlayColor={'rgba(0, 0, 0, 0.60)'}
            />
            <FlatList
              data={list}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={renderEmpty()}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  blur_image: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
    opacity: 0.2,
    marginBottom: 30,
    borderColor: colorLogo.color4,
    borderRadius: 10,
  },
  solid_image: {
    width: 170,
    height: 230,
    resizeMode: 'contain',
    borderColor: colorLogo.color4,
  },
};
export default AdminPreventifListShowCheckStandart;
