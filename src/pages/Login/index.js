import React, {useState} from 'react';
import {
  View,
  StatusBar,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {Input, Button} from '../../component';
import {companyLogo, welcomeLogo} from '../../assets';
import {colors, colorsInput} from '../../utils';
import {useDispatch} from 'react-redux';
import {setForm} from '../../redux';
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
import {login_style} from '../../styles';
import {AuthenticationAPIService} from '../../services';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function FieldPassword(props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <TextInput
        style={styles.inputPassword}
        placeholder="Password"
        placeholderTextColor={colorsInput.default}
        secureTextEntry={props.secEntry}
        onChangeText={value => props.onInputChange(value, 'password')}
        value={props.password}
      />
      <TouchableOpacity
        onPress={() => props.changeShow()}
        style={{
          borderColor: colorsInput.default,
          alignItems: 'center',
          paddingVertical: 9,
          marginLeft: -wp('10%'),
          width: wp('10%'),
          textAlign: 'center',
          color: colorsInput.default,
        }}>
        <IconFontAwesome5
          name={props.secIcon}
          size={18}
          color={colorsInput.default}
        />
      </TouchableOpacity>
    </View>
  );
}

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [secEntry, setSecEntry] = useState(true);
  const [secIcon, setSecIcon] = useState('eye-slash');
  const [inLogin, setInLogin] = useState({username: '', password: ''});

  const sendData = async () => {
    if (inLogin.username == '') {
      Alert.alert('Attention!', 'Please fill Username');
    } else if (inLogin.password == '') {
      Alert.alert('Attention!', 'Please fill Password');
    } else {
      try {
        setLoading(true);
        const data = {
          usernm: inLogin.username,
          passwd: inLogin.password,
        };
        const res = await AuthenticationAPIService.login(data);
        if (res.data.res == 'success') {
          dispatch(setForm(res.data.profile));
          navigation.replace('AdminDashboard');
        } else {
          setLoading(false);
          Alert.alert('Attention', 'Please fill valid Username & Password');
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', error.message);
        setLoading(false);
      }
    }
  };

  const onInputChange = (value, inputType) => {
    setInLogin({...inLogin, [inputType]: value});
  };

  const changeShow = () => {
    if (secEntry == true) {
      setSecEntry(false);
      setSecIcon('eye');
    } else {
      setSecEntry(true);
      setSecIcon('eye-slash');
    }
  };

  return (
    <View style={styles.wrapper.page}>
      <KeyboardAwareScrollView contentContainerStyle={styles.wrapper.content}>
        <Spinner
          visible={loading}
          textContent={'Login...'}
          textStyle={{color: '#FFF'}}
        />
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={colors.default}
        />
        <Image
          source={welcomeLogo}
          resizeMethod="resize"
          style={styles.utils.image}
        />
        <View style={styles.space(15)} />
        <Input
          placeholder="Username"
          value={inLogin.username}
          onChangeText={value => onInputChange(value, 'username')}
        />
        <View style={styles.space(15)} />
        <FieldPassword
          secEntry={secEntry}
          secIcon={secIcon}
          password={inLogin.password}
          onInputChange={onInputChange}
          changeShow={changeShow}
        />
        <View style={styles.space(10)} />
        <Button title="Submit" onPress={sendData} />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = {
  wrapper: {
    page: {
      flex: 1,
      backgroundColor: colors.default,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  utils: {
    text: {
      fontSize: 16,
    },
    image: {
      height: hp('60%'),
      width: wp('90%'),
      resizeMode: 'contain',
    },
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: colorsInput.default,
    borderRadius: 25,
    paddingVertical: 5,
    width: wp('90%'),
    textAlign: 'center',
    fontSize: 14,
    color: colorsInput.default,
  },
  space: value => {
    return {
      height: value,
    };
  },
};

export default Login;
