import React, {useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {ActionButtonAttachmentMultipleShow} from '../../../ActionButton';
import {InputForm, InputTime, SelectDynamic} from '../../../../../component';
import moment from 'moment';
import {global_style} from '../../../../../styles';

const FormShow = props => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const [needItemParams, setNeedItemParams] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [timeTaken, setTimeTaken] = useState(moment().toDate());
  const [fileExistsMultiple, setFileExistsMultiple] = useState([[], []]);
  const subTitleMultiple = ['Before Condition', 'After Condition'];
  const [activity, setActivity] = useState('');
  const [fullDate, setFullDate] = useState('');

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setFullDate(
        days[moment(CorrectiveReducer.stateData.created_date).day()] +
          ', ' +
          moment(CorrectiveReducer.stateData.created_date).format('DD MMMM Y'),
      );
      setTimeTaken(moment(CorrectiveReducer.stateData.time_taken).toDate());
      setActivity(CorrectiveReducer.stateData.description);
      if (CorrectiveReducer.stateData.attachment != '') {
        CorrectiveReducer.stateData.attachment.map(resources => {
          const source = {
            uri: resources,
          };
          let item = {
            url: source,
          };
          fileExistsMultiple[0].push(item);
        });
        setFileExistsMultiple(fileExistsMultiple);
      }

      if (CorrectiveReducer.stateData.attachment_after != '') {
        CorrectiveReducer.stateData.attachment_after.map(resources => {
          const source = {
            uri: resources,
          };
          let item = {
            url: source,
          };
          fileExistsMultiple[1].push(item);
        });
        setFileExistsMultiple(fileExistsMultiple);
      }

      if (CorrectiveReducer.stateData.request_item > 0) {
        setShowRequest(true);
        setNeedItemParams(CorrectiveReducer.stateData.request_item_need);
      }
    });
    return unsubscribe;
  }, [props]);

  return (
    <View style={global_style.sub_page}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={global_style.content}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '65%'}}>
              <InputForm placeholder="date" value={fullDate} editable={false} />
            </View>
            <View style={{width: '30%'}}>
              <InputTime
                placeholder="time taken"
                value={timeTaken ? moment(timeTaken).format('HH:mm') : ''}
                editable={false}
              />
            </View>
          </View>
          <InputForm
            placeholder="activity"
            value={activity}
            multiline={true}
            editable={false}
            onChangeText={value => setActivity(value)}
          />
          <ActionButtonAttachmentMultipleShow
            title="Attachment"
            fileExists={fileExistsMultiple}
            subTitle={subTitleMultiple}
          />
          {showRequest &&
            needItemParams.map(user => (
              <View style={{marginTop: 10}} key={user.id}>
                <SelectDynamic
                  listMode="MODAL"
                  modalProps={{
                    animationType: 'Slide',
                  }}
                  searchable={true}
                  loading={false}
                  disableLocalSearch={true}
                  onChangeSearchText={text => console.log(user.id, text)}
                  key={user.id}
                  open={user.open}
                  value={user.value}
                  items={user.items}
                  setOpen={open => console.log(user.id, open)}
                  setValue={callback => console.log(user.id, callback)}
                  onChangeValue={val => {
                    console.log(user.id, val);
                  }}
                  itemSeparator={true}
                  placeholderItem={'Item'}
                  placeholderQty={'Qty'}
                  deleted={false}
                  disabled={true}
                  editable={false}
                  onPress={() => console.log(user.id)}
                  valQty={user.qty}
                  valOnHand={user.qtyOnHand.toString()}
                  onChangeText={val => console.log(user.id, val)}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1, paddingRight: 10}}>
                    <InputForm
                      editable={false}
                      placeholder="Prepared By"
                      value={user.preparedBy == 'E' ? 'Tenant' : 'MMP'}
                    />
                  </View>
                  <View style={{paddingRight: 10}}>
                    <View>
                      <InputForm
                        editable={false}
                        placeholder="Qty"
                        keyboardType="numeric"
                        value={user.qty}
                      />
                    </View>
                  </View>
                </View>

                {user.showNote && (
                  <View style={{marginTop: 5}}>
                    <InputForm
                      editable={false}
                      placeholder={'Description'}
                      value={user.description}
                    />
                  </View>
                )}
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default FormShow;
