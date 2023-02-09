import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colorLogo} from '../../../utils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {global_style} from '../../../styles';
import {Body, CheckBox, Content, ListItem, Right} from 'native-base';
import {Button} from '../Button/index';
import {TextLineIndentLight} from '../Text/index';

export const ModalShowImage = ({imageURL, visible, setVisible, ...rest}) => {
  return (
    <Modal
      style={{...rest}}
      animationType={'fade'}
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}>
      <View
        style={{
          flex: 1,
          padding: 40,
          backgroundColor: 'rgba(0,0,0,0.9)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={imageURL}
          style={{
            flex: 1,
            height: Dimensions.get('window').height / 3 - 12,
            width: '100%',
            marginBottom: 5,
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
          onPress={setVisible}>
          <Icon
            type="FontAwesome"
            active
            name="times"
            style={{
              color: '#FFFFFF',
              fontSize: 14,
            }}
          />
          Close
        </Text>
      </View>
    </Modal>
  );
};

export const ModalCheckbox = ({visible, setVisible, list}) => {
  const renderItem = ({item, index}) => {
    return (
      <View>
        <ListItem
          // onPress={() => chkbox_check(item, index)}
          style={{paddingLeft: 0, marginLeft: 0}}>
          <CheckBox
            // onPress={() => chkbox_check(item, index)}
            checked={list[index].isChecked == 'true' ? true : false}
            style={{paddingLeft: 0, marginLeft: 0, marginTop: 0, paddingTop: 0}}
          />
          <Body>
            <Text style={{marginLeft: 15}}>{item.fullname}</Text>
          </Body>
        </ListItem>
      </View>
    );
  };

  // const chkbox_check = (item, ind) => {
  //   let tmp = list;
  //   let res = '';
  //   if (tmp.includes(item)) {
  //     // tmp.isChecked == true
  //     if (item.isChecked == 'true') {
  //       tmp.find(tmp => tmp.username === item.username).isChecked = 'false';
  //     } else {
  //       tmp.find(tmp => tmp.username === item.username).isChecked = 'true';
  //     }
  //   }
  //   setListEngineer([...tmp]);
  // };
  console.log(list);
  return (
    <Modal animationType={'slide'} transparent={false} visible={visible}>
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
          <Button title="Close" onPress={setVisible} />
        </View>
      </View>
    </Modal>
  );
};

export const ModalShowForm = props => {
  return (
    <Modal
      style={props.style}
      animationType="slide"
      transparent={true}
      visible={props.visible}>
      <View
        style={{
          height: '70%',
          marginTop: 'auto',
          backgroundColor: colorLogo.color2,
        }}>
        <TextLineIndentLight label="Type" value="type" />
      </View>
    </Modal>
  );
};
