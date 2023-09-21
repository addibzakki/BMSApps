import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  SkeletonFakeList,
  TextLineIndentLight,
  TopHeader,
} from '../../../../component';
import {global_style} from '../../../../styles';
import {Body, Left, ListItem} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import {colorButton, colorLogo} from '../../../../utils';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import {addPhoto} from '../../../../assets';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';

const includeExtra = true;
const AdminPreventifListCheckStandart = ({navigation}) => {
  console.log('list_check_standard');

  const PreventifReducer = useSelector(state => state.PreventifReducer);
  const [processing, setProcessing] = useState(false);
  const [list, setList] = useState([]);
  const [fileList, setFileList] = useState(null);
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [typeSource, setTypeSource] = useState('Photo');
  const [showVideos, setShowVideos] = useState(false);
  const listOption = [
    {id: null, label: '-', enabled: true},
    {id: 13, label: 'Normal', enabled: true},
    {id: 18, label: 'Warning', enabled: true},
    {id: 14, label: 'Damage', enabled: true},
  ];
  const [selected, setSelected] = useState('');

  // video
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [screenType, setScreenType] = useState('content');

  const onSeek = seek => {
    //Handler for change in seekbar
    videoPlayer.current.seek(seek);
  };

  const onPaused = playerState => {
    //Handler for Video Pause
    setPaused(!paused);
    setPlayerState(playerState);
  };

  const onReplay = () => {
    //Handler for Replay
    setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayer.current.seek(0);
  };

  const onProgress = data => {
    // Video Player will progress continue even if it ends
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = data => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = data => setIsLoading(true);

  const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

  const onError = () => alert('Oh! ', error);

  const exitFullScreen = () => {
    alert('Exit full screen');
  };

  const enterFullScreen = () => {};

  const onFullScreen = () => {
    setIsFullScreen(isFullScreen);
    if (screenType == 'content') setScreenType('cover');
    else setScreenType('content');
  };

  const renderToolbar = () => (
    <View>
      <Text style={styles.toolbar}> toolbar </Text>
    </View>
  );

  const onSeeking = currentTime => setCurrentTime(currentTime);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const getData = async () => {
    try {
      var temp = [];
      db.transaction(txn => {
        txn.executeSql(
          'SELECT * FROM pv_checkstandart_tmp WHERE id_checklist = ? AND process = 0 LIMIT 1',
          [PreventifReducer.check_standart.id],
          (txn, res) => {
            for (let i = 0; i < res.rows.length; ++i) {
              temp.push(res.rows.item(i));
              console.log('push successfully');
            }
            setList([...temp]);
          },
          error => {
            console.log('error on select table list_meter ' + error.message);
          },
        );
        txn.executeSql(
          'SELECT count(*) as total, (SELECT count(*) FROM pv_checkstandart_tmp WHERE process = 1 AND id_checklist = a.id_checklist) as checked FROM pv_checkstandart_tmp a WHERE a.id_checklist = ?',
          [PreventifReducer.check_standart.id],
          (txn, res) => {
            setTotal(res.rows.item(0)['total']);
            setRemaining(res.rows.item(0)['checked']);
          },
          error => {
            console.log('error on select table list_meter ' + error.message);
          },
        );
      });

      setProcessing(false);
    } catch (error) {
      Alert.alert('Error', error.message);
      setProcessing(false);
    }
  };

  const handleTakePhoto = () => {
    ImagePicker.launchCamera(
      {
        title: 'Take Photo',
        options: {
          saveToPhotos: true,
          mediaType: 'photo',
          includeExtra,
        },
      },
      response => {
        if (response.didCancel) {
          console.log('cancel take picture');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          Alert.alert(response.customButton);
        } else if (response.error) {
          console.log('LaunchCamera Error: ', response.error);
        } else {
          ImageResizer.createResizedImage(response.uri, 800, 600, 'JPEG', 90)
            .then(response => {
              const source = {uri: response.uri};
              setFileList(source);
              setPicture(response);
              setTypeSource('Photo');
            })
            .catch(err => {
              console.log(err);
              return Alert.alert(
                'Unable to resize the photo',
                'Please try again!',
              );
            });
        }
      },
    );
  };

  const handleTakeVideos = async () => {
    ImagePicker.launchCamera(
      {
        title: 'Take Video',
        mediaType: 'video',
        videoQuality: 'low',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      response => {
        if (response.didCancel) {
          console.log('cancel take picture');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          Alert.alert(response.customButton);
        } else if (response.error) {
          console.log('LaunchCamera Error: ', response.error);
        } else {
          const source = {uri: response.uri};
          setFileList(source);
          setPicture(response);
          setTypeSource('video');
        }
      },
    );
  };

  const handleSubmitCheckStandart = item => {
    if (item.required == 1 && selected == '') {
      Alert.alert(
        'Attention!',
        'Task point ' + item.task_name + ' is required',
      );
      return false;
    }
    if (item.image_required == 1 && fileList == null) {
      Alert.alert(
        'Attention!',
        'Image task point ' + item.task_name + ' has been required',
      );
      return false;
    }
    if (item.video_required == 1 && fileList == null) {
      Alert.alert(
        'Attention!',
        'Video task point ' + item.task_name + ' has been required',
      );
      return false;
    }

    setProcessing(true);

    db.transaction(txn => {
      txn.executeSql(
        'UPDATE pv_checkstandart_tmp SET images = ?, remark = ?, status = ?, process = 1 WHERE id = ?',
        [
          fileList == null ? '' : fileList.uri,
          text,
          selected == '' ? '' : selected,
          item.id,
        ],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            console.log('update check standart successfully');
            checkStandartChecking();
            getData();
            setFileList(null);
            setText('');
            setSelected('');
            setTypeSource('Photo');
            setShowVideos(false);
          }
        },
        error => {
          console.log(
            'error on select table pv_checkstandart_tmp ' + error.message,
          );
        },
      );
    });
  };

  const checkStandartChecking = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT count(*) as total, (SELECT count(*) FROM pv_checkstandart_tmp WHERE required = 1 AND process = 1 AND id_checklist = a.id_checklist) as checked FROM pv_checkstandart_tmp a WHERE a.required = 1 AND a.id_checklist = ?',
        [PreventifReducer.check_standart.id],
        (txn, res) => {
          console.log(res.rows.item(0)['total']);
          if (res.rows.item(0)['checked'] == res.rows.item(0)['total']) {
            txn.executeSql(
              "UPDATE pv_checklist_tmp SET status_id = 6, status_name = 'Done', status_color = '#00ff59' WHERE id = ?",
              [PreventifReducer.check_standart.id],
              (txn, res) => {
                if (res.rowsAffected > 0) {
                  console.log('update checklist status successfully');
                }
              },
              error => {
                console.log(
                  'error on select table pv_checkstandart_tmp ' + error.message,
                );
              },
            );
          } else {
            console.log('On Progress');
            txn.executeSql(
              "UPDATE pv_checklist_tmp SET status_id = 2, status_name = 'On Progress', status_color = '#0062ff' WHERE id = ?",
              [PreventifReducer.check_standart.id],
              (txn, res) => {
                if (res.rowsAffected > 0) {
                  console.log('update checklist status successfully');
                }
              },
              error => {
                console.log(
                  'error on select table pv_checkstandart_tmp ' + error.message,
                );
              },
            );
          }
        },
        error => {
          console.log('error on select table list_meter ' + error.message);
        },
      );
    });
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
          <Text style={global_style.text_empty}>NOTHING CHECK STANDART</Text>
        </View>
      );
    }
  };

  const ShowFile = props => {
    if (props.type == 'Photo') {
      return (
        <TouchableOpacity
          style={{width: '15%', justifyContent: 'center'}}
          onPress={() => handleTakePhoto()}>
          <Image
            source={fileList == null ? addPhoto : {uri: fileList.uri}}
            style={
              fileList == null
                ? {width: 30, height: 30, opacity: 0.3}
                : styles.solid_image
            }
          />
        </TouchableOpacity>
      );
    } else if (props.type == 'Video') {
      return (
        <TouchableOpacity
          style={{width: '15%', justifyContent: 'center'}}
          onPress={() => handleTakeVideos()}>
          <Image
            source={fileList == null ? addPhoto : {uri: fileList.uri}}
            style={
              fileList == null
                ? {width: 30, height: 30, opacity: 0.3}
                : styles.solid_image
            }
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{width: '15%', justifyContent: 'center'}}
          onPress={() => setModalVisible(true)}>
          <Image
            source={fileList == null ? addPhoto : {uri: fileList.uri}}
            style={
              fileList == null
                ? {width: 30, height: 30, opacity: 0.3}
                : styles.solid_image
            }
          />
        </TouchableOpacity>
      );
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

    const list_option = [];
    if (item.status_option != undefined) {
      list_option.push({id: '', label: '-'});
      JSON.parse(item.status_option).map(val => {
        const source = {id: val.bms_status_id, label: val.status_name};
        list_option.push(source);
      });
    }

    const option = list_option.map(item => {
      return (
        <Picker.Item
          key={item.id}
          label={item.label}
          value={item.id}
          enabled={item.enabled}
        />
      );
    });
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
            <TextLineIndentLight label="Point" value={item.task_name} />
            <TextLineIndentLight label="Desc" value={item.task_description} />
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
                <ShowFile
                  type={
                    item.video_required == 1
                      ? 'Video'
                      : item.image_required == 1
                      ? 'Photo'
                      : 'All'
                  }
                />
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
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  textAlign: 'justify',
                  width: '20%',
                  flexWrap: 'wrap',
                }}>
                <Text>Status</Text>
              </View>
              <Text
                style={{
                  textAlign: 'justify',
                  width: '1%',
                  flexWrap: 'wrap',
                }}>
                :
              </Text>
              <View
                style={{
                  textAlign: 'justify',
                  width: '75%',
                }}>
                <Picker
                  placeholder="Start Year"
                  mode="dropdown"
                  style={{height: 20}}
                  itemStyle={{fontSize: 8}}
                  selectedValue={selected}
                  onValueChange={item => setSelected(item)}>
                  {option}
                </Picker>
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

          <View>
            <Text
              style={{
                fontSize: 14,
                textTransform: 'capitalize',
                color: colorLogo.color3,
                marginBottom: 5,
              }}>
              Remarks
            </Text>
            <View style={{marginRight: 5}}>
              <TextInput
                multiline={true}
                value={text}
                onChangeText={val => setText(val)}
                style={{
                  borderWidth: 1,
                  marginRight: 10,
                  fontSize: 12,
                  textAlignVertical: 'top',
                  borderRadius: 10,
                  padding: 10,
                  borderColor: colorLogo.color5,
                }}
              />
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.5,
              marginVertical: 10,
              borderColor: background_color,
            }}
          />
          <TouchableOpacity
            style={{
              marginRight: 15,
              marginTop: 5,
              borderRadius: 10,
              alignItems: 'center',
              paddingVertical: 5,
              backgroundColor: colorButton.submit,
            }}
            onPress={() => handleSubmitCheckStandart(item)}>
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>
        </Body>
      </ListItem>
    );
  };

  return (
    <View style={global_style.page}>
      <Spinner
        visible={processing}
        textContent={'Processing...'}
        textStyle={{color: '#FFF'}}
        overlayColor={'rgba(0, 0, 0, 0.60)'}
      />
      <TopHeader
        title="Preventive"
        subTitle={'Check Standart (' + remaining + '/' + total + ')'}
        onPress={() => navigation.navigate('AdminPreventifListChecklist')}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        // style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        onRequestClose={() => {
          // this.closeButtonFunction()
        }}>
        <View
          style={{
            height: '100%',
            marginTop: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              height: '20%',
              marginTop: 'auto',
              backgroundColor: colorLogo.color3,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              paddingTop: 10,
              paddingHorizontal: 10,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                handleTakePhoto();
              }}
              style={{
                backgroundColor: colorLogo.color5,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text>
                <Icon name="camera-outline" size={16} /> Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                handleTakeVideos();
              }}
              style={{
                backgroundColor: colorLogo.color5,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text>
                <Icon name="videocam-outline" size={16} /> Video
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: colorLogo.color1,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text style={{color: 'white'}}>
                <Icon name="close" size={16} /> Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showVideos}
        // style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        onRequestClose={() => {
          // this.closeButtonFunction()
        }}>
        <View
          style={{
            height: '100%',
            marginTop: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: '95%',
              backgroundColor: colorLogo.color3,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              paddingTop: 10,
              // paddingHorizontal: 10,
              justifyContent: 'space-around',
            }}>
            {fileList !== null && (
              <View>
                <Video
                  onEnd={onEnd}
                  onLoad={onLoad}
                  onLoadStart={onLoadStart}
                  onProgress={onProgress}
                  paused={paused}
                  ref={videoPlayer}
                  resizeMode={screenType}
                  onFullScreen={isFullScreen}
                  source={{
                    uri: fileList.uri,
                  }}
                  style={styles.mediaPlayer}
                  volume={10}
                />
                <MediaControls
                  duration={duration}
                  isLoading={isLoading}
                  mainColor="#333"
                  onFullScreen={onFullScreen}
                  onPaused={onPaused}
                  onReplay={onReplay}
                  onSeek={onSeek}
                  onSeeking={onSeeking}
                  playerState={playerState}
                  progress={currentTime}
                  toolbar={renderToolbar()}
                />
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setShowVideos(false)}
            style={{
              backgroundColor: colorLogo.color1,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              // marginVertical: 10,
            }}>
            <Text style={{color: 'white'}}>
              <Icon name="close" size={16} /> Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={global_style.sub_page}>
        <View style={[global_style.content, {flex: 1}]}>
          <View>
            <FlatList
              data={list}
              renderItem={renderItem}
              ListEmptyComponent={renderEmpty()}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    aspectRatio: 1,
    // position: 'absolute',
    justifyContent: 'center',
  },

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
    width: 90,
    height: 90,
    // resizeMode: 'stretch',
    borderColor: colorLogo.color4,
  },
});
export default AdminPreventifListCheckStandart;
