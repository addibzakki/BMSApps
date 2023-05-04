import React, {useState, useEffect} from 'react';
import {View, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {InputForm, TopHeader, SelectSearch} from '../../../component';
import {colorLogo} from '../../../utils';
import {useDispatch} from 'react-redux';
import {
  setInfoMeterID,
  clearInfoMeterID,
  setInfoMeter,
  setInfoTenant,
  setLastReadingMeter,
} from '../Action';
import {ActionButton} from '../ActionButton';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

const AdminMeterReading = ({navigation}) => {
  const MeterReducer = useSelector(state => state.MeterReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [listEntity, setListEntity] = useState([]);
  const [meterID, setMeterID] = useState('');

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      dispatch(clearInfoMeterID());
      getData();
    }
    return () => {
      unmounted = true;
    };
  }, []);

  const getData = () => {
    const url = 'https://mmpportal.mmproperty.com/api/get_entity/list';
    axios
      .get(url)
      .then(function(response) {
        setListEntity([...response.data]);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const onSetMeterID = typing => {
    console.log(value);
    if (value == null) {
      Alert.alert('Attention', 'Please select entity first');
    } else {
      setMeterID(typing);
      // dispatch(setInfoMeterID(typing + '::' + value));
    }
    // dispatch(setInfoMeterID(value));
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

  const handleNext = () => {
    if (meterID != '' && value != null) {
      // setLoading(true);
      let combineMeterId = meterID + '::' + value;
      const url =
        'https://mmpportal.mmproperty.com/api/meter_reading/' + combineMeterId;
      axios
        .get(url)
        .then(function(response) {
          if (response.data.validation == 'valid') {
            dispatch(setInfoMeterID(combineMeterId));
            dispatch(setInfoMeter(response.data.meterInfo));
            dispatch(setInfoTenant(response.data.tenantInfo));
            dispatch(setLastReadingMeter(response.data.lastread));
            setLoading(false);
            navigation.navigate('AdminMeterWriting');
          } else {
            setLoading(false);
            Alert.alert('Warning', 'Meter ID not match, Please check meter ID');
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      if (value == null) {
        Alert.alert('Warning', 'Please enter entity');
      } else {
        Alert.alert('Warning', 'Please enter meter id');
      }
    }
  };

  return (
    <View style={styles.wrapper.page}>
      <Spinner
        visible={loading}
        textContent={'Checking meter...'}
        textStyle={{color: '#FFF'}}
      />
      <TopHeader
        title="Meter Reading"
        subTitle="Input Meter"
        onPress={() => navigation.replace('AdminMeter')}
        onPressHome={() => ButtonAlert()}
      />
      <View style={styles.wrapper.subPage}>
        <View style={styles.space(10)} />
        <View style={styles.wrapper.content}>
          <SelectSearch
            listMode="MODAL"
            modalProps={{
              animationType: 'Slide',
            }}
            searchable={true}
            placeholder="Entity"
            open={open}
            value={value}
            items={listEntity}
            setOpen={setOpen}
            setValue={setValue}
            itemSeparator={true}
          />
          <View style={styles.space(10)} />
          <InputForm
            placeholder="Meter ID"
            autoCapitalize="characters"
            value={meterID}
            onChangeText={value => onSetMeterID(value)}
          />
        </View>
        <View style={styles.space(20)} />
        <ActionButton title="Next" onPress={() => handleNext()} />
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
  space: value => {
    return {
      height: value,
    };
  },
};

export default AdminMeterReading;
