import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colorsInput, colorLogo} from '../../../utils';
import NumericInput from 'react-native-numeric-input';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';

export const Input = ({placeholder, ...rest}) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={colorsInput.default}
      {...rest}
    />
  );
};

export const InputPassword = ({
  placeholder,
  securityEntry,
  onPress,
  ...rest
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <TextInput
        style={styles.inputPassword}
        placeholder={placeholder}
        placeholderTextColor={colorsInput.default}
        secureTextEntry={securityEntry}
        {...rest}
      />
      <TouchableOpacity
        onPress={onPress}
        style={{
          borderWidth: 1,
          borderColor: colorsInput.default,
          borderTopRightRadius: 25,
          borderBottomRightRadius: 25,
          alignItems: 'center',
          paddingVertical: 9,
          width: wp('10%'),
          textAlign: 'center',
          color: colorsInput.default,
        }}>
        <IconFontAwesome5 name="eye" size={18} />
      </TouchableOpacity>
    </View>
  );
};

export const InputForm = ({placeholder, ...rest}) => {
  return (
    <View style={{marginBottom: 15}}>
      <Text style={styles.text2}>{placeholder}</Text>
      <View style={styles.space(5)} />
      <TextInput
        style={styles.inputForm2}
        placeholderTextColor={colorLogo.color3}
        {...rest}
      />
    </View>
  );
};

export const InputDropdownForm = ({placeholder, ...rest}) => {
  return (
    <View style={{marginBottom: 15}}>
      <Text style={styles.text2}>{placeholder}</Text>
      <View style={styles.space(5)} />
      <DropDownPicker
        style={{height: 40}}
        listMode="MODAL"
        modalProps={{
          animationType: 'Slide',
        }}
        {...rest}
      />
    </View>
  );
};

export const InputFormSearch = ({placeholder, ...rest}) => {
  return (
    <View>
      <TextInput
        style={styles.inputForm2}
        placeholder={placeholder}
        placeholderTextColor={colorLogo.color3}
        {...rest}
      />
    </View>
  );
};

export const InputFormWithButton = ({placeholder, onPress, icon, ...rest}) => {
  return (
    <View>
      <Text style={styles.text2}>{placeholder}</Text>
      <View style={styles.space(5)} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={styles.inputFormIcon}
          placeholderTextColor={colorLogo.color3}
          {...rest}
        />
        <TouchableOpacity
          onPress={onPress}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colorLogo.color3,
            color: colorLogo.color3,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Icon name={icon} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const InputFormSignature = ({title, onPress, icon, signature}) => {
  return (
    <View>
      <Text style={styles.text2}>{title}</Text>
      <View style={styles.space(5)} />
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <View style={styles.preview}>
          {signature ? (
            <Image
              resizeMode={'contain'}
              // style={{flex: 1, height: 114}}
              style={{width: '100%', height: 114}}
              source={{uri: signature}}
            />
          ) : null}
        </View>
        <View style={{width: '15%'}}>
          <TouchableOpacity
            onPress={onPress}
            style={{
              flex: 1,
              height: 114,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: colorLogo.color3,
              color: colorLogo.color3,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconFontAwesome5 name={icon} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const InputTime = ({placeholder, onPress, ...rest}) => {
  return (
    <View>
      <Text style={styles.text2}>{placeholder}</Text>
      <View style={styles.space(5)} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={styles.inputFormIcon}
          placeholderTextColor={colorLogo.color3}
          {...rest}
        />
        <TouchableOpacity
          onPress={onPress}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colorLogo.color3,
            color: colorLogo.color3,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Icon name="time-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const InputPopup = ({placeholder, onPress, ...rest}) => {
  return (
    <View>
      <Text style={styles.text2}>{placeholder}</Text>
      <View style={styles.space(5)} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={styles.inputFormIcon}
          placeholderTextColor={colorLogo.color3}
          editable={false}
          {...rest}
        />
        <TouchableOpacity
          onPress={onPress}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colorLogo.color3,
            color: colorLogo.color3,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Icon name="people-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const InputNumber = ({placeholder, ...rest}) => {
  return (
    <View>
      <Text style={styles.text2}>{placeholder}</Text>
      <View style={styles.space(5)} />
      <NumericInput
        borderColor={colorLogo.color4}
        iconStyle={{color: 'white'}}
        rightButtonBackgroundColor={colorLogo.color4}
        leftButtonBackgroundColor={colorLogo.color4}
        containerStyle={{width: '100%'}}
        totalWidth={140}
        totalHeight={40}
        valueType="real"
        rounded
        {...rest}
      />
    </View>
  );
};

export const InputDynamic = ({placeholder, onPress, ...rest}) => {
  return (
    <View style={{marginBottom: 15}}>
      <Text style={styles.text2}>{placeholder}</Text>
      <View style={styles.space(5)} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={styles.inputFormIcon}
          placeholderTextColor={colorLogo.color3}
          {...rest}
        />
        <TouchableOpacity
          onPress={onPress}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colorLogo.color3,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            backgroundColor: '#c62828',
          }}>
          <Icon name="close-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const InputDateRangeFilter = ({placeholder, onPress, ...rest}) => {
  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          placeholder={placeholder}
          style={styles.inputFormIcon}
          placeholderTextColor={colorLogo.color3}
          {...rest}
        />
        <TouchableOpacity
          onPress={onPress}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colorLogo.color3,
            color: colorLogo.color3,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Icon name="calendar-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const InputRichText = (props, ...rest) => {
  const [text, setText] = useState(props.value);
  const handleSave = () => {
    // console.log(props.id);
    db.transaction(txn => {
      txn.executeSql(
        'UPDATE list_preventif_temp SET remark = ? WHERE id = ?',
        [text, props.id],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            console.log('save remark successfully');
          }
        },
        error => {
          console.log('error on select table list_meter ' + error.message);
        },
      );
    });
  };

  return (
    <View>
      <Text style={styles.text2}>{props.title}</Text>
      <View style={styles.space(5)} />
      <View style={{flexDirection: 'row', marginRight: 10}}>
        <View style={{width: '85%'}}>
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

        <TouchableOpacity
          disabled={props.value == text ? true : false}
          style={{
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center',
            // borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={() => handleSave()}>
          <Icon
            type="FontAwesome"
            name="save"
            size={30}
            color={props.value == text ? colorLogo.color5 : colorLogo.color4}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colorsInput.default,
    borderRadius: 25,
    paddingVertical: 5,
    width: wp('90%'),
    textAlign: 'center',
    fontSize: 14,
    color: colorsInput.default,
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: colorsInput.default,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    paddingVertical: 5,
    width: wp('80%'),
    textAlign: 'center',
    fontSize: 14,
    color: colorsInput.default,
  },
  inputForm: {
    borderWidth: 1,
    borderColor: colorsInput.default,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    color: colorsInput.default,
  },
  inputForm2: {
    borderWidth: 1,
    borderColor: colorLogo.color3,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    color: colorLogo.color3,
    backgroundColor: 'white',
  },
  inputFormIcon: {
    flex: 1,
    borderWidth: 1,
    borderColor: colorLogo.color3,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    color: colorLogo.color3,
  },
  text: {
    letterSpacing: 2,
    fontWeight: 'bold',
    color: colorsInput.default,
  },
  text2: {
    fontSize: 12,
    // letterSpacing: 2,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: colorLogo.color3,
  },
  preview: {
    width: '85%',
    height: 114,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  space: value => {
    return {
      height: value,
    };
  },
});
