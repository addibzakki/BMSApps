import React, {useEffect} from 'react';
import {View, StatusBar, Image, Text} from 'react-native';
import {splashLogo} from '../../assets';
import {useSelector} from 'react-redux';
import {colors} from '../../utils';
import DeviceInfo from 'react-native-device-info';
import {createTables, deleteExpiredTables} from '../../component';
import {db_cm_tenant_ticket_tmp} from '../../component/databases/create/create_cm_tenant_ticket';
import {db_gl_area_tmp} from '../../component/databases/create/create_gl_area';
import {db_cm_assignment_pic_tmp} from '../../component/databases/create/create_cm_assignment_pic';
import {db_gl_user_tmp} from '../../component/databases/create/create_gl_user';
import {db_cm_item_tmp} from '../../component/databases/create/create_cm_item';
import {db_cm_onhand_tmp} from '../../component/databases/create/create_cm_onhand';
import {db_cm_action_tmp} from '../../component/databases/create/create_cm_action';
import {db_pv_checklist_tmp} from '../../component/databases/create/create_pv_checklist_tmp';
import {db_pv_checkstandart_tmp} from '../../component/databases/create/create_pv_checkstandart_tmp';

const Splash = ({navigation}) => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      table_collection();
      setTimeout(() => {
        if (LoginReducer.isIntro == 'true') {
          if (LoginReducer.isLogin == 'true') {
            navigation.replace('AdminDashboard');
          } else {
            navigation.replace('Login');
          }
        } else {
          navigation.replace('Introduce');
        }
      }, 2000);
    }
    return () => {
      unmounted = true;
    };
  }, []);

  const table_collection = () => {
    console.log('table collection');
    createTables(db, 'bms_meter');
    createTables(db, 'bms_volume_trx_temp');
    createTables(db, 'list_meter');
    createTables(db, 'bms_meter_temp');
    createTables(db, 'bms_meter_log');

    db_pv_checklist_tmp(db);
    db_pv_checkstandart_tmp(db);
    db_cm_tenant_ticket_tmp(db);
    db_cm_assignment_pic_tmp(db);
    db_cm_item_tmp(db);
    db_cm_action_tmp(db);
    db_cm_onhand_tmp(db);
    db_gl_user_tmp(db);
    db_gl_area_tmp(db);
    deleteExpiredTables(db);
  };

  return (
    <View style={styles.wrapper.component}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colors.default}
      />
      <Image source={splashLogo} resizeMethod="resize" />
      <View style={{position: 'absolute', bottom: 30}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          {DeviceInfo.getApplicationName()} V.{DeviceInfo.getVersion()}
        </Text>
      </View>
    </View>
  );
};

const styles = {
  wrapper: {
    component: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.default,
    },
  },
};

export default Splash;
