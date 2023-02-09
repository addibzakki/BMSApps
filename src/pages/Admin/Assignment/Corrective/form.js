import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {TopHeader} from '../../../../component';
import {global_style} from '../../../../styles';
import FormCreate from './Forms/form_create';
import FormModify from './Forms/form_modify';
import FormConfirmItem from './Forms/form_confirm_item';
import FormConfirmAvailableItem from './Forms/form_confirm_available_item';
import FormModifyFixItem from './Forms/form_modify_fix_item';
import FormShow from './Forms/form_show';

const AdminHelpdeskForm = ({navigation}) => {
  console.log('in main form corrective');
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  console.log(CorrectiveReducer.type);
  let form_activity;
  if (CorrectiveReducer.type == 'add') {
    form_activity = <FormCreate navigation={navigation} />;
  }
  if (CorrectiveReducer.type == 'modify') {
    form_activity = <FormModify navigation={navigation} />;
  }
  if (CorrectiveReducer.type == 'confirm-item') {
    form_activity = <FormConfirmItem navigation={navigation} />;
  }
  if (CorrectiveReducer.type == 'confirm-available-item') {
    form_activity = <FormConfirmAvailableItem navigation={navigation} />;
  }
  if (CorrectiveReducer.type == 'modify-item-fix') {
    form_activity = <FormModifyFixItem navigation={navigation} />;
  }
  if (CorrectiveReducer.type == 'show') {
    form_activity = <FormShow navigation={navigation} />;
  }

  return (
    <View style={global_style.page}>
      <TopHeader
        title="Form Activity"
        subTitle={CorrectiveReducer.ticket_no}
        onPress={() => {
          navigation.goBack();
        }}
        onPressHome={() => navigation.navigate('AdminDashboard')}
      />
      {form_activity}
    </View>
  );
};

export default AdminHelpdeskForm;
