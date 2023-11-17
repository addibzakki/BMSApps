import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  InputDropdownForm,
  InputForm,
  ListAttachment,
  TopHeader,
} from '../../component';
import ImagePicker from 'react-native-image-picker';
import { Icon } from 'native-base';
import ImageResizer from 'react-native-image-resizer';
import ImageMarker from 'react-native-image-marker';
import {colorLogo} from '../../utils';
import Spinner from 'react-native-loading-spinner-overlay';
import { ActionButton, ActionButtonAttachment, ActionButtonAttachmentMultipleShow } from '../Admin/ActionButton';
import PettyLAPIService from '../../services/Petty/PettyAPIService';

const PettyShowRequest = ({route, navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(route.params.amount);
  const [description, setDescription] = useState(route.params.descs);
  const [fileList, setFileList] = useState([]);
  const [fileListExist, setFileListExist] = useState([]);
  const [entityProject, setEntityProject] = useState('');
  const [projectNo, setProjectNo] = useState('');
  const [valueLocation, setValueLocation] = useState(route.params.entity_project+'::'+route.params.project_no);
  const [openLocation, setOpenLocation] = useState(false);
  const [listLocation, setListLocation] = useState([]);
  const [picture, setPicture] = useState([]);

  
  console.log(route.params);

  const options = {
    title: 'Select Photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    storageOptions: {
      skipBackup: true,
    },
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, []);

  const getData = async () => {
    try {
      const res = await PettyLAPIService.getDetailRequest(
        route.params.id,
      );
      res.data.data.attachment_file.map(resources => {
        const source = {
          uri: resources,
        };
        let item = {
          url: source,
        };
        fileListExist.push(item);
      });
      setFileListExist(fileListExist);
      const resp = await PettyLAPIService.getLocation({
        spv: LoginReducer.form.profile.uid,
      });
      setListLocation([...resp.data.location]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSetLocation = async itemValue => {
    const index = listLocation.findIndex(val => val.id == itemValue);
    if (index >= 0) {
      const loc = itemValue.split('::');
      setEntityProject(loc[0]);
      setProjectNo(loc[1]);
    }
  };

  const handleUpload = () => {
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
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
            var d = new Date();
            var dd =
              ('0' + d.getDate()).slice(-2) +
              '-' +
              ('0' + (d.getMonth() + 1)).slice(-2) +
              '-' +
              d.getFullYear() +
              ' ' +
              d.getHours() +
              ':' +
              (d.getMinutes() < 10 ? '0' : '') +
              d.getMinutes() +
              ':' +
              (d.getSeconds() < 10 ? '0' : '') +
              d.getSeconds();
            var dateNow = dd.toString();
            ImageMarker.markText({
              src: response.uri,
              text: 'Date : ' + dateNow,
              position: 'bottomLeft',
              color: '#FFFFFF',
              fontName: 'Arial-BoldItalicMT',
              fontSize: 20,
              scale: 1,
              quality: 100,
            })
              .then(res => {
                let uri = 'file://' + res;
                onSelectedImage({ uri: uri });
                console.log('the path is' + res);
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
            return Alert.alert(
              'Unable to resize the photo',
              'Please try again!',
            );
          });
      }
    });
  };

  const handleNext = (action) => {
    if (amount == '' || amount == '0') {
      Alert.alert('Attention', 'Please fill amount value');
    } else if (parseInt(amount) > 1000000) {
      Alert.alert('Attention', 'Amount Over Limit');
    } else if (description == '') {
      Alert.alert('Attention', 'Please fill description value');
    } else {
      Alert.alert(
        'Attention',
        (action == 're-submit' ? 'Are you sure to resubmit this request?' : 'Are you sure to modify this request?'),
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => processModify(true) },
        ],
      );
    }
  };

  const onSelectedImage = image => {
    let newDataImg = fileList;
    const source = { uri: image.uri };
    let item = {
      url: source,
    };
    newDataImg.push(item);
    let joined = picture.concat(image);
    setFileList(newDataImg);
    setPicture(joined);
  };

  const processModify = async () => {
    setLoading(true);
    try {
      let uploadData = new FormData();
      picture.map(resources => {
        uploadData.append('attachment[]', {
          type: 'image/jpeg',
          uri: resources.uri,
          name: resources.uri.substring(resources.uri.lastIndexOf('/') + 1),
        });
      });
      uploadData.append('id', route.params.id);
      uploadData.append('entity_project', entityProject);
      uploadData.append('project_no', projectNo);
      uploadData.append('username', LoginReducer.form.profile.uid);
      uploadData.append('descs', description);
      uploadData.append('amount', amount);
      uploadData.append('updated_by', LoginReducer.form.profile.uid);
      uploadData.append('status', 'S');

      console.log(uploadData);
      const res = await PettyLAPIService.modifyRequest(uploadData);
      if (res.data.code == 200) {
        Alert.alert(
          'Success',
          res.data.message,
          [
            { text: 'Ok', onPress: () => navigation.replace('PettyHistoryRequest') },
          ],
        );
        setLoading(false);
      } else {
        Alert.alert('Error', res.data.message);
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
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
        textContent={'Updating Request...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title={'Petty Cash'}
        subTitle={'Detail Request'}
        onPress={() => navigation.replace('PettyHistoryRequest')}
        onPressHome={() => ButtonAlert()}
      />
      
      <View style={styles.wrapper.subPage}>
        <ScrollView>
          <View style={styles.space(10)} />
          <View style={styles.wrapper.content}>
            <InputDropdownForm
              placeholder="Location *"
              searchable={false}
              open={openLocation}
              value={valueLocation}
              items={listLocation}
              setOpen={setOpenLocation}
              setValue={setValueLocation}
              onChangeValue={val => handleSetLocation(val)}
              itemSeparator={true}
              disabled={route.params.status == 'R' || route.params.status == 'S' ? false : true}
            />
            <InputForm
              placeholder="Amount"
              keyboardType="number-pad"
              value={amount.toString()}
              editable={route.params.status == 'R' || route.params.status == 'S' ? true : false}
            />
              <InputForm
                placeholder="Status"
                value={route.params.status_desc}
                editable={false}
              />
            <InputForm
              placeholder="Description"
              multiline={true}
              value={description}
              editable={route.params.status == 'R' || route.params.status == 'S' ? true : false}
            />
            {
              route.params.status == 'R' && (<InputForm
                placeholder="Note"
                multiline={true}
                value={route.params.remarks}
                editable={route.params.status == 'R' || route.params.status == 'S' ? true:false }
              />)
            }
            {/* <ListAttachment list={fileListExist} /> */}
            <ActionButtonAttachment
              title="Attachment"
              onPress={() => handleUpload()}
              list={fileList}
              show={route.params.status == 'R' || route.params.status == 'S' ? true : false}
              fileExists={fileListExist}
            />
            <View style={styles.space(15)} />
          </View>
          <View style={styles.space(20)} />
          {
            route.params.status == 'R' && (<ActionButton title="Re-submit" onPress={() => handleNext('re-submit')} />)
          }
          {
            route.params.status == 'S' && (<ActionButton title="Modify" onPress={() => handleNext('modify')} />)
          }
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

export default PettyShowRequest;
