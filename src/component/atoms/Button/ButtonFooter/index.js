import React from 'react';
import {View} from 'react-native';
import {Footer, FooterTab} from 'native-base';
import {ButtonCreateActivity} from '../crm_button/buttonCreateActivity';
import {ButtonTemporaryCloseActivity} from '../crm_button/buttonTemporaryClose';
import {ButtonDoneActivity} from '../crm_button/buttonDoneActivity';
import {ButtonConfirmJobDone} from '../crm_button/buttonConfirmJobDoneActivity';
import {cm_style} from '../../../../styles';
import {useSelector} from 'react-redux';
import {ButtonShowActivity} from '../crm_button/buttonShowActivity';
import {ButtonAddMoreAssigment} from '../crm_button/buttonAddMoreAssignment';
import {ButtonAssign} from '../crm_button/buttonAssign';
import {ButtonRequestTransfer} from '../crm_button/buttonRequestTransfer';
import {ButtonResponseTicket} from '../crm_button/buttonResponseTicket';
import {ButtonTakeNoteActivity} from '../crm_button/buttonTakeNoteActivity';
import { ButtonTransfer } from '../crm_button/buttonTransfer';

export const ButtonActionFooter = props => {
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
  const LoginReducer = useSelector(state => state.LoginReducer);

  const level = LoginReducer.form.profile.level;
  const ticket_status_id = CorrectiveReducer.ticket_status_id;
  const ticket_status_tenant = CorrectiveReducer.ticket_status_tenant;

  let listButton;
  if (level == 'Supervisor') {
    if (ticket_status_id == '4') {
      listButton = (
        <Footer>
          <FooterTab>
            <ButtonTakeNoteActivity navigation={props.navigation} />
            <ButtonConfirmJobDone
              params={props.data}
              navigation={props.navigation}
            />
          </FooterTab>
        </Footer>
      );
    }
  }
  if (level == 'Engineer' && CorrectiveReducer.pic_status == 'A') {
    if (ticket_status_id == '1') {
      listButton = (
        <Footer>
          <FooterTab>
            <ButtonCreateActivity navigation={props.navigation} />
          </FooterTab>
        </Footer>
      );
    }
    if (ticket_status_id == '2') {
      listButton = (
        <Footer>
          <FooterTab>
            <ButtonCreateActivity navigation={props.navigation} />
            <ButtonTemporaryCloseActivity navigation={props.navigation} />
            <ButtonDoneActivity navigation={props.navigation} />
          </FooterTab>
        </Footer>
      );
    }

    if (ticket_status_tenant == '4') {
      listButton = (
        <Footer>
          <FooterTab>
            <ButtonCreateActivity navigation={props.navigation} />
          </FooterTab>
        </Footer>
      );
    }
  }

  return (
    <View
      style={{
        borderWidth: 0.5,
        bottom: 0,
        width: '100%',
        alignSelf: 'flex-end',
      }}>
      {listButton}
    </View>
  );
};

export const ButtonActionShow = props => {
  const LoginReducer = useSelector(state => state.LoginReducer);
  const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);

  let button;
  let buttonRequestTransfer;

  if (LoginReducer.form.profile.level == 'Supervisor') {
    if (props.data_spv.assignment_response == null) {
      console.log('assign to engineer');
      button = (
        <Footer>
          <FooterTab>
            <ButtonResponseTicket
              data={props.data}
              navigation={props.navigation}
            />
          </FooterTab>
        </Footer>
      );
    } else if (
      props.data.status_id < 2 &&
      (props.data.supervisor == LoginReducer.form.profile.uid ||
        props.data.supervisor == null)
    ) {
      console.log('assign to engineer');
      button = (
        <Footer>
          <FooterTab>
            {props.data.is_ticket_pd == 'Y' ? null : <ButtonTransfer data={props.data} navigation={props.navigation} />}
            <ButtonAssign data={props.data} navigation={props.navigation} />
          </FooterTab>
        </Footer>
      );
      // }
    } else if (props.data.status_id > 1 && props.data.status_id < 5) {
      button = (
        <Footer>
          <FooterTab>
            {props.data.is_ticket_pd == 'Y' ? null : <ButtonTransfer data={props.data} navigation={props.navigation} />}
            <ButtonShowActivity navigation={props.navigation} />
            <ButtonAddMoreAssigment
              data={props.data}
              navigation={props.navigation}
            />
          </FooterTab>
        </Footer>
      );
    } else if (props.data.status_id >= 5) {
      button = (
        <Footer>
          <FooterTab>
            <ButtonShowActivity navigation={props.navigation} />
          </FooterTab>
        </Footer>
      );
    }
  } else {
    // if (CorrectiveReducer.checklist == 'true') {
    if (CorrectiveReducer.pic_status == 'A') {
      if (props.data.status_id < 5) {
        buttonRequestTransfer = (
          <ButtonRequestTransfer navigation={props.navigation} />
        );
      }
    }
    button = (
      <Footer>
        <FooterTab>
          <ButtonShowActivity navigation={props.navigation} />
          {buttonRequestTransfer}
        </FooterTab>
      </Footer>
    );
    // }
  }
  return <View style={cm_style.footer}>{button}</View>;
};
