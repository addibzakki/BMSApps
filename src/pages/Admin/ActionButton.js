import React, {useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {
  Button,
  ButtonAttachment,
  Radio,
  ModalShowImage,
  ButtonHalf,
} from '../../component';
import {colorLogo} from '../../utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import {addPhoto} from '../../assets';

export const ActionButton = ({title, onPress, ...rest}) => {
  return (
    <View style={{paddingHorizontal: 20}}>
      <Button title={title} onPress={onPress} {...rest} />
    </View>
  );
};

export const ActionButtonHalf = ({title, onPress, ...rest}) => {
  return (
    <View style={{paddingHorizontal: 5, flex: 1}}>
      <ButtonHalf title={title} onPress={onPress} {...rest} />
    </View>
  );
};

export const ActionButtonRadio = ({title = '', list, initial, onPress}) => {
  let title_show;
  if (title !== '') {
    title_show = (
      <Text style={{fontSize: 16, color: colorLogo.color3, paddingBottom: 10}}>
        {title}
      </Text>
    );
  }
  return (
    <View>
      {title_show}
      <Radio initial={initial} list={list} onPress={onPress} />
    </View>
  );
};

export const ActionButtonAttachment = ({
  title,
  onPress,
  list,
  blank = '',
  show = true,
  fileExists = [],
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const HandleModalVisible = (value, file) => {
    setModalOpen(value);
    setModalImage(file.url.uri);
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          height: 160,
          width: 150,
          paddingLeft: 5,
          marginRight: 5,
          marginVertical: 5,
        }}>
        <TouchableWithoutFeedback
          onPress={() => HandleModalVisible(true, item)}>
          <Image
            source={item.url}
            style={{
              height: 150,
              width: 150,
              paddingHorizontal: 10,
            }}
            resizeMethod="resize"
          />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const listEmptyComponent = (blank, fileExists) => {
    if (fileExists == '') {
      return (
        <View
          style={{
            padding: 10,
            marginVertical: 5,
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: colorLogo.color3,
              fontWeight: 'bold',
              // letterSpacing: 2,
              // textTransform: 'uppercase',
              fontSize: 12,
            }}>
            {blank}
          </Text>
        </View>
      );
    }
  };

  let add_button;
  if (show == true) {
    add_button = <ButtonAttachment title="ADD" onPress={onPress} />;
  }
  return (
    <View>
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={modalOpen}
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
              uri: modalImage,
            }}
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
            onPress={() => setModalOpen(false)}>
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
      <Text
        style={{
          fontSize: 12,
          // textTransform: 'uppercase',
          fontWeight: 'bold',
          letterSpacing: 2,
          color: colorLogo.color3,
        }}>
        {title}
      </Text>
      <View style={styles.space(5)} />
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: colorLogo.color3,
        }}>
        {fileExists.map(item => {
          return (
            <View
              style={{
                height: 50,
                width: null,
                borderRadius: 8,
                resizeMode: 'contain',
                marginVertical: 5,
              }}>
              <TouchableWithoutFeedback
                onPress={() => HandleModalVisible(true, item)}>
              <Image
                source={(item.url == 'undefined' ? item:item.url)}
                style={{
                  height: 50,
                  width: null,
                  borderRadius: 8,
                  resizeMode: 'contain',
                  marginVertical: 5,
                }}
                resizeMethod="resize"
              />
              </TouchableWithoutFeedback>
            </View>
          );
        })}
        <FlatList
          horizontal
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={listEmptyComponent(blank, fileExists)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.space(10)} />
        {add_button}
      </View>
    </View>
  );
};

export const ActionButtonAttachmentMultiple = ({
  title,
  subTitle,
  onPress,
  list,
  fileExists = [],
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const HandleModalVisible = (value, file) => {
    setModalOpen(value);
    setModalImage(file.url.uri);
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          height: 100,
          width: 100,
          paddingLeft: 10,
          marginRight: 10,
          marginVertical: 5,
        }}>
        <TouchableWithoutFeedback
          onPress={() => HandleModalVisible(true, item)}>
          <Image
            source={item.url}
            style={{
              height: 100,
              width: 100,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
            resizeMethod="resize"
          />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <View>
      <ModalShowImage
        imageURL={modalImage}
        visible={modalOpen}
        setVisible={() => setModalOpen(false)}
      />
      <Text
        style={{
          fontSize: 12,
          // textTransform: 'uppercase',
          fontWeight: 'bold',
          // letterSpacing: 2,
          color: colorLogo.color3,
        }}>
        {title}
      </Text>
      <View style={styles.space(5)} />
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: colorLogo.color3,
        }}>
        {list.map((val, id) => {
          return (
            <View>
              <Text
                style={{
                  fontSize: 12,
                  paddingLeft: 10,
                  paddingTop: 10,
                  // textTransform: 'uppercase',
                  fontWeight: 'bold',
                  // letterSpacing: 2,
                  color: colorLogo.color3,
                }}>
                {subTitle[id]}
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{flexDirection: 'row'}}>
                <View
                  style={{
                    height: 100,
                    width: 100,
                    marginRight: 10,
                    marginLeft: 10,
                    marginVertical: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: colorLogo.color5,
                    // borderStyle: 'dashed',
                    // borderWidth: 1,
                    // borderRadius: 10,
                  }}>
                  <TouchableWithoutFeedback onPress={onPress[id]}>
                    <Image
                      source={addPhoto}
                      style={{
                        height: 50,
                        width: 50,
                        opacity: 0.3,
                      }}
                      resizeMethod="resize"
                    />
                  </TouchableWithoutFeedback>
                </View>
                {fileExists[id].map(item => {
                  return (
                    <View
                      style={{
                        height: 100,
                        width: 100,
                        paddingLeft: 10,
                        marginRight: 10,
                        marginVertical: 5,
                      }}>
                      <TouchableWithoutFeedback
                        onPress={() => HandleModalVisible(true, item)}>
                        <Image
                          source={item.url}
                          style={{
                            height: 100,
                            width: 100,
                            paddingHorizontal: 10,
                          }}
                          resizeMethod="resize"
                        />
                      </TouchableWithoutFeedback>
                    </View>
                  );
                })}
                <FlatList
                  horizontal
                  data={list[id]}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                />
              </ScrollView>
              <View style={styles.space(5)} />
            </View>
          );
        })}
      </View>
    </View>
  );
};

export const ActionButtonAttachmentMultipleShow = ({
  title,
  subTitle,
  fileExists = [],
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const HandleModalVisible = (value, file) => {
    setModalOpen(value);
    setModalImage({uri: file.url.uri});
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          height: 100,
          width: 100,
          paddingLeft: 10,
          marginRight: 10,
          marginVertical: 5,
        }}>
        <TouchableWithoutFeedback
          onPress={() => HandleModalVisible(true, item)}>
          <Image
            source={item.url}
            style={{
              height: 100,
              width: 100,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
            resizeMethod="resize"
          />
        </TouchableWithoutFeedback>
      </View>
    );
  };
  const listEmptyComponent = (blank, fileExists) => {
    if (fileExists == '') {
      return (
        <View
          style={{
            padding: 10,
            marginVertical: 5,
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: colorLogo.color3,
              fontWeight: 'bold',
              // letterSpacing: 2,
              // textTransform: 'uppercase',
              fontSize: 12,
            }}>
            {blank}
          </Text>
        </View>
      );
    }
  };

  let listImage = [];
  for (let id = 0; id < 2; id++) {
    listImage.push(
      <View>
        <Text
          style={{
            fontSize: 12,
            paddingLeft: 10,
            paddingTop: 10,
            // textTransform: 'uppercase',
            fontWeight: 'bold',
            // letterSpacing: 2,
            color: colorLogo.color3,
          }}>
          {subTitle[id]}
        </Text>

        <FlatList
          horizontal={true}
          removeClippedSubviews={true}
          data={fileExists[id]}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={listEmptyComponent(
            '--Nothing Image Capture--',
            fileExists[id],
          )}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.space(5)} />
      </View>,
    );
  }

  return (
    <View>
      <ModalShowImage
        imageURL={modalImage}
        visible={modalOpen}
        setVisible={() => setModalOpen(false)}
      />
      <Text
        style={{
          fontSize: 12,
          // textTransform: 'uppercase',
          fontWeight: 'bold',
          letterSpacing: 2,
          color: colorLogo.color3,
        }}>
        {title}
      </Text>
      <View style={styles.space(5)} />
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: colorLogo.color3,
        }}>
        {listImage}
      </View>
    </View>
  );
};

export const ActionButtonAttachmentShow = ({
  title,
  list,
  blank = 'No Photo',
  fileExists = [],
}) => {
  const renderItem = ({item}) => {
    return (
      <View
        style={{
          height: 100,
          width: null,
          borderRadius: 8,
          resizeMode: 'contain',
          marginVertical: 5,
        }}>
        <TouchableWithoutFeedback
          onPress={() => HandleModalVisible(true, item)}>
          <Image
            source={item.url}
            style={{
              height: 100,
              width: null,
              borderRadius: 8,
              resizeMode: 'contain',
              marginVertical: 5,
            }}
            resizeMethod="resize"
          />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const listEmptyComponent = (blank, fileExists) => {
    if (fileExists == '') {
      return (
        <View
          style={{
            padding: 10,
            marginVertical: 5,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: colorLogo.color3,
              fontWeight: 'bold',
              // letterSpacing: 2,
              // textTransform: 'uppercase',
              fontSize: 12,
            }}>
            {blank}
          </Text>
        </View>
      );
    }
  };
  return (
    <View>
      <Text
        style={{
          // textTransform: 'uppercase',
          fontWeight: 'bold',
          // letterSpacing: 2,
          color: colorLogo.color3,
        }}>
        {title}
      </Text>
      <View style={styles.space(5)} />
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: colorLogo.color3,
        }}>
        {fileExists.map(item => {
          return (
            <View
              style={{
                height: 250,
                width: null,
                borderRadius: 8,
                resizeMode: 'contain',
                marginVertical: 5,
              }}>
              <Image
                source={item.url}
                style={{
                  height: 250,
                  width: null,
                  borderRadius: 8,
                  resizeMode: 'contain',
                  marginVertical: 5,
                }}
                resizeMethod="resize"
              />
            </View>
          );
        })}
        <FlatList
          removeClippedSubviews={true}
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={listEmptyComponent(blank, fileExists)}
        />
      </View>
    </View>
  );
};

const styles = {
  space: value => {
    return {
      height: value,
    };
  },
};
