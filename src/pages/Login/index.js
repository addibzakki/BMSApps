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
import {companyLogo} from '../../assets';
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

function FieldPassword(props) {
  return (
    <View style={login_style.sectionStyle}>
      <View style={login_style.fieldPassword}>
        <TextInput
          style={login_style.inputPassword}
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
        console.log(data);
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
    <View style={login_style.page}>
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={login_style.content}>
        <View>
          <KeyboardAvoidingView enabled>
            <Animatable.View animation="slideInDown" style={login_style.brand}>
              <Image
                source={companyLogo}
                resizeMethod="resize"
                style={login_style.image}
              />
              <Text style={login_style.textBranding}>MMP</Text>
              <Text style={login_style.textSubBranding}>
                BUILDING MANAGEMENT SYSTEM
              </Text>
              <Text style={login_style.textSubBranding}>(DEVELOPMENT)</Text>
            </Animatable.View>
            <Animatable.View animation="slideInUp">
              <View style={login_style.sectionStyle}>
                <Text style={login_style.textError}>{info}</Text>
                <Input
                  placeholder="Username"
                  value={inLogin.username}
                  onChangeText={value => onInputChange(value, 'username')}
                />
              </View>
              <FieldPassword
                secEntry={secEntry}
                secIcon={secIcon}
                password={inLogin.password}
                onInputChange={onInputChange}
                changeShow={changeShow}
              />
              <View style={login_style.sectionButtonStyle}>
                <Button title="Submit" onPress={sendData} />
              </View>
              <Text style={login_style.textVersion}>
                V.{DeviceInfo.getVersion()}
              </Text>
            </Animatable.View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default Login;
