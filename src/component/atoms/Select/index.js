import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {colorLogo} from '../../../utils';
import {Picker} from '@react-native-picker/picker';
import {CheckBox} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import {InputForm} from '../Input';
import {useDispatch, useSelector} from 'react-redux';
import {setRefresh} from '../../../redux';

export const Select = ({placeholder, list, ...rest}) => {
  const option = list.map(item => {
    return <Picker.Item key={item.id} label={item.label} value={item.id} />;
  });
  return (
    <View>
      <Text style={styles.text}>{placeholder}</Text>
      <View style={styles.space(5)} />
      <View style={styles.wrapperPicker}>
        <Picker style={styles.picker} {...rest}>
          {option}
        </Picker>
      </View>
    </View>
  );
};

export const SelectDynamic = ({
  placeholderItem,
  placeholderQty,
  list,
  onPress,
  valOnHand,
  valQty,
  deleted,
  onChangeText,
  ...rest
}) => {
  let del_button = false;
  if (deleted == true) {
    del_button = (
      <View style={{paddingTop: 20}}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colorLogo.color3,
            borderRadius: 10,
            backgroundColor: '#c62828',
          }}>
          <Icon name="close-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.directRow}>
      <View style={{flex: 1, paddingRight: 10}}>
        <Text style={styles.text}>{placeholderItem}</Text>
        <View style={styles.space(5)} />
        <DropDownPicker style={{height: 40}} {...rest} />
      </View>

      <View style={{paddingRight: 10}}>
        <View>
          <InputForm
            editable={false}
            placeholder="Remaining"
            keyboardType="numeric"
            value={valOnHand}
          />
        </View>
      </View>
      {del_button}
    </View>
  );
};

export const SelectSearch = ({placeholder, list, ...rest}) => {
  // const option = list.map(item => {
  //   return <Picker.Item key={item.id} label={item.label} value={item.id} />;
  // });
  return (
    <View>
      <Text style={styles.text}>{placeholder}</Text>
      <View style={styles.space(5)} />
      <View style={styles.wrapperPicker}>
        <DropDownPicker style={{height: 40}} {...rest} />
      </View>
    </View>
  );
};

export const SelectDynamicShow = ({
  placeholderItem,
  placeholderQty,
  list,
  onPress,
  valQty,
  onChangeText,
  editable,
  ...rest
}) => {
  return (
    <View style={styles.directRow}>
      <View style={{flex: 1, paddingRight: 10}}>
        <Text style={styles.text}>{placeholderItem}</Text>
        <View style={styles.space(5)} />
        <DropDownPicker style={{height: 40}} {...rest} />
      </View>

      <View style={{paddingRight: 10}}>
        <View>
          <InputForm
            editable={editable}
            placeholder={placeholderQty}
            keyboardType="numeric"
            value={valQty}
            onChangeText={onChangeText}
          />
        </View>
      </View>
    </View>
  );
};

export const SelectChecklistShow = ({
  placeholderItem,
  placeholderQty,
  list,
  onPress,
  valQty,
  valOnHand,
  checked,
  valChecked,
  preparedBy,
  description,
  ...rest
}) => {
  return (
    <View>
      <View style={styles.directRow}>
        <View style={{paddingRight: 20, justifyContent: 'center'}}>
          <CheckBox
            onPress={checked}
            checked={valChecked}
            style={{paddingLeft: 0, marginLeft: 0, marginTop: 0, paddingTop: 0}}
          />
        </View>

        <View style={{flex: 1, paddingRight: 10}}>
          <Text style={styles.text}>{placeholderItem}</Text>
          <View style={styles.space(5)} />
          <DropDownPicker style={{height: 40}} {...rest} />
        </View>

        <View style={{paddingRight: 10}}>
          <View>
            <InputForm
              editable={false}
              placeholder={placeholderQty}
              keyboardType="numeric"
              value={valQty}
            />
          </View>
        </View>
      </View>
      {description != null && (
        <View style={{paddingLeft: 40}}>
          <InputForm
            editable={false}
            placeholder="Description"
            value={description}
          />
        </View>
      )}
      <View style={styles.directRow}>
        <View style={{flex: 1, paddingLeft: 40, paddingRight: 10}}>
          <InputForm
            editable={false}
            placeholder="Prepared By"
            value={preparedBy}
          />
        </View>
        <View style={{paddingRight: 10}}>
          <View>
            <InputForm
              editable={false}
              placeholder="Onhand"
              value={valOnHand}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export const SelectInline = props => {
  const dispatch = useDispatch();
  const GlobalReducer = useSelector(state => state.GlobalReducer);
  const listOption = [
    {id: null, label: '-', enabled: false},
    {id: 13, label: 'Ok', enabled: true},
    {id: 14, label: 'Not Ok', enabled: true},
    {id: 18, label: 'Normal', enabled: true},
  ];
  const [selected, setSelected] = useState(props.value);
  const option = listOption.map(item => {
    return (
      <Picker.Item
        key={item.id}
        label={item.label}
        value={item.id}
        enabled={item.enabled}
      />
    );
  });

  const onChangeSelected = item => {
    db.transaction(txn => {
      txn.executeSql(
        'UPDATE pv_checkstandart_tmp SET status = ? WHERE id = ?',
        [item, props.id],
        (txn, res) => {
          console.log(res.rowsAffected);
          dispatch(setRefresh(true));
          if (res.rowsAffected > 0) {
            console.log('change status successfully');
            console.log('dispacth running');
            console.log(GlobalReducer.refresh);
          }
        },
        error => {
          console.log('error on select table list_meter ' + error.message);
        },
      );
    });
    setSelected(item);
  };
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View
        style={{
          textAlign: 'justify',
          width: '20%',
          flexWrap: 'wrap',
        }}>
        <Text>{props.title}</Text>
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
          onValueChange={item => onChangeSelected(item)}>
          {option}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperPicker: {
    borderWidth: 1,
    borderColor: colorLogo.color3,
    borderRadius: 10,
    color: colorLogo.color3,
  },
  wrapperPickerDynamic: {
    borderWidth: 1,
    borderColor: colorLogo.color3,
    borderRadius: 10,
    color: colorLogo.color3,
  },
  inputForm: {
    flex: 1,
    borderWidth: 1,
    borderColor: colorLogo.color3,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    color: colorLogo.color3,
  },
  directRow: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
  },
  picker: {
    marginVertical: -5,
  },
  text: {
    fontSize: 12,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: colorLogo.color3,
  },
  space: value => {
    return {
      height: value,
    };
  },
});
