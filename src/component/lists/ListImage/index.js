import React, {useState} from 'react';
import {
  Image,
  TouchableWithoutFeedback,
  View,
  FlatList,
  Text,
} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import {ModalShowImage} from '../../atoms/Modal/index';
import {addPhoto} from '../../../assets';
import {cm_style} from '../../../styles';
import {SkeletonFakeImage} from '../../layouts/skeleton/index';

export const ListImage = props => {
  const [modalImage, setModalImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const HandleModalVisible = (value, file) => {
    setModalVisible(value);
    setModalImage(file);
  };

  const renderItem = ({item, selection, index}) => {
    let imgSource;
    if (typeof item.url == 'object') {
      imgSource = item.url;
    } else {
      imgSource = {uri: item.url};
    }
    return (
      <TouchableWithoutFeedback
        onPress={() => HandleModalVisible(true, imgSource)}>
        <Image
          source={imgSource}
          // source={item.url.match('url') == null ? {uri: item.url} : item.url}
          style={{
            justifyContent: 'flex-end',
            borderRadius: 5,
            padding: 10,
            height: 150,
          }}
        />
      </TouchableWithoutFeedback>
    );
  };
  const renderEmpty = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          padding: 10,
          marginBottom: 10,
        }}>
        <Image
          source={addPhoto}
          style={{
            width: 200,
            height: 200,
            opacity: 0.3,
            borderWidth: 1,
            borderRadius: 10,
          }}
        />
      </View>
    );
  };
  return (
    <View style={props.style}>
      <ModalShowImage
        imageURL={modalImage}
        visible={modalVisible}
        setVisible={() => setModalVisible(false)}
      />
      <FlatGrid
        itemDimension={90}
        data={props.list.concat(props.listExists)}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

export const ListAttachment = props => {
  const [modalImage, setModalImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  const HandleModalVisible = (value, file) => {
    setModalVisible(value);
    setModalImage({uri: file});
  };

  const renderItem = ({item, selection, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => HandleModalVisible(true, item)}>
        <Image source={{uri: item}} style={cm_style.image_size} />
      </TouchableWithoutFeedback>
    );
  };
  const renderEmpty = () => {
    if (loading == true) {
      return <SkeletonFakeImage />;
    } else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', margin: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            ATTACHMENT NOT AVAILABLE
          </Text>
        </View>
      );
    }
  };
  return (
    <View>
      <ModalShowImage
        imageURL={modalImage}
        visible={modalVisible}
        setVisible={() => setModalVisible(false)}
      />
      <FlatList
        removeClippedSubviews={true}
        data={props.list}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty()}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />
    </View>
  );
};
