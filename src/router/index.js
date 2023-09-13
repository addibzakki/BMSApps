import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {
  Splash,
  Profile,
  Login,
  Register,
  WelcomeAuth,
  Introduce,
  Comming,
  AdminAssignment,
  AdminDashboard,
  AdminMeter,
  AdminMeterReadingDashboard,
  AdminMeterReading,
  AdminMeterListHistory,
  AdminMeterDetail,
  AdminMeterUpload,
  AdminMeterFilter,
  AdminMeterBarcode,
  AdminMeterWriting,
  AdminMeterHistory,
  AdminMeterRead,
  AdminMeterUnread,
  AdminHelpdesk,
  AdminHelpdeskForm,
  AdminHelpdeskList,
  AdminHelpdeskShow,
  AdminHelpdeskEngineer,
  AdminHelpdeskPriority,
  AdminHelpdeskType,
  AdminHelpdeskActivity,
  AdminHelpdeskHistory,
  WorkArea,
  AdminHelpdeskCategory,
  FormArea,
  AdminPreventif,
  AdminPreventifPhotoBefore,
  AdminPreventifListChecklist,
  AdminPreventifToCorrective,
  AdminPreventifListHistory,
  AdminPreventifShow,
  AdminPreventiveDashboard,
  AdminPreventifConfirmSubmit,
  AdminPreventifListCheckStandart,
  AdminPreventifListHistoryCheckStandart,
  AdminPreventifListShowChecklist,
  AdminPreventifListShowCheckStandart,
  AdminPreventifListShowHistoryChecklist,
  AdminPreventifListAssignment,
  AdminSPL,
  RequestSPL,
  ListSPL,
  ShowSPL,
  HistorySPL,
  ApprovalSPL,
  FormApprovalSPL,
  ListApprovalSPL,
  AdminPreventiveAssetHistory,
} from '../pages';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colorsBar, colorLogo} from '../utils';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Tabs = createBottomTabNavigator();

function dashboardTab() {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        showLabel: false,
        labelStyle: {
          color: 'white',
          fontSize: 12,
          textTransform: 'uppercase',
          marginBottom: 5,
        },
        style: {backgroundColor: colorLogo.color4},
      }}
      barStyle={{backgroundColor: colorLogo.color4}}
      activeColor={colorsBar.active}
      inactiveColor={colorsBar.inactive}>
      <Tabs.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="monitor-dashboard"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="monitor-dashboard"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="face-profile"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="face-profile"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
    </Tabs.Navigator>
  );
}

function AdminMeterSearchDashboard({route}) {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        showLabel: true,
        labelStyle: {
          color: 'white',
          fontSize: 12,
          textTransform: 'uppercase',
          marginBottom: 5,
        },
        style: {backgroundColor: colorLogo.color4},
      }}
      barStyle={{backgroundColor: colorLogo.color4}}
      activeColor={colorsBar.active}
      inactiveColor={colorsBar.inactive}>
      <Tabs.Screen
        name="Read"
        component={AdminMeterRead}
        initialParams={route.params}
        options={{
          tabBarLabel: 'Read',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="flash"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="flash"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
      <Tabs.Screen
        name="Unread"
        component={AdminMeterUnread}
        initialParams={route.params}
        options={{
          tabBarLabel: 'Unread',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="water"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="water"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
    </Tabs.Navigator>
  );
}

function AdminHelpdeskDashboard() {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        showLabel: true,
        labelStyle: {
          color: 'white',
          fontSize: 12,
          textTransform: 'uppercase',
          marginBottom: 5,
        },
        style: {backgroundColor: colorLogo.color4},
      }}
      barStyle={{backgroundColor: colorLogo.color4}}
      activeColor={colorsBar.active}
      inactiveColor={colorsBar.inactive}>
      <Tabs.Screen
        name="Ticket"
        component={AdminHelpdesk}
        options={{
          tabBarLabel: 'Ticket',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="ticket-outline"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="ticket-outline"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
      <Tabs.Screen
        name="History"
        component={AdminHelpdeskHistory}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="history"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="history"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
    </Tabs.Navigator>
  );
}

function AdminSPVPreventifApproval() {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        showLabel: true,
        labelStyle: {
          color: 'white',
          fontSize: 12,
          textTransform: 'uppercase',
          marginBottom: 5,
        },
        style: {backgroundColor: colorLogo.color4},
      }}
      barStyle={{backgroundColor: colorLogo.color4}}
      activeColor={colorsBar.active}
      inactiveColor={colorsBar.inactive}>
      <Tabs.Screen
        name="Submit Preventive"
        component={AdminPreventifConfirmSubmit}
        options={{
          tabBarLabel: 'Submit Preventive',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="ticket-outline"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="ticket-outline"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
      <Tabs.Screen
        name="Submit To Corrective"
        component={AdminPreventifToCorrective}
        options={{
          tabBarLabel: 'Submit To Corrective',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="ticket-outline"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="ticket-outline"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
    </Tabs.Navigator>
  );
}

function AdminPreventiveAssignment() {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        showLabel: true,
        labelStyle: {
          color: 'white',
          fontSize: 12,
          textTransform: 'uppercase',
          marginBottom: 5,
        },
        style: {backgroundColor: colorLogo.color4},
      }}
      barStyle={{backgroundColor: colorLogo.color4}}
      activeColor={colorsBar.active}
      inactiveColor={colorsBar.inactive}>
      <Tabs.Screen
        name="Preventive"
        component={AdminPreventifListAssignment}
        options={{
          tabBarLabel: 'Preventive',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="ticket-outline"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="ticket-outline"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
      <Tabs.Screen
        name="History"
        component={AdminPreventifListHistory}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="history"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="history"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
    </Tabs.Navigator>
  );
}

function PreventiveCheckStandart() {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        showLabel: true,
        labelStyle: {
          color: 'white',
          fontSize: 12,
          textTransform: 'uppercase',
          marginBottom: 5,
        },
        style: {backgroundColor: colorLogo.color4},
      }}
      barStyle={{backgroundColor: colorLogo.color4}}
      activeColor={colorsBar.active}
      inactiveColor={colorsBar.inactive}>
      <Tabs.Screen
        name="Point"
        component={AdminPreventifListCheckStandart}
        options={{
          tabBarLabel: 'Point',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="ticket-outline"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="ticket-outline"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
      <Tabs.Screen
        name="History"
        component={AdminPreventifListHistoryCheckStandart}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return (
                <MaterialCommunityIcons
                  name="history"
                  color={colorsBar.active}
                  size={22}
                />
              );
            } else {
              return (
                <MaterialCommunityIcons
                  name="history"
                  color={colorsBar.inactive}
                  size={22}
                />
              );
            }
          },
        }}
      />
    </Tabs.Navigator>
  );
}

const Router = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WelcomeAuth"
        component={WelcomeAuth}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Introduce"
        component={Introduce}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Comming"
        component={Comming}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={dashboardTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeter"
        component={AdminMeter}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterReadingDashboard"
        component={AdminMeterReadingDashboard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterReading"
        component={AdminMeterReading}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterListHistory"
        component={AdminMeterListHistory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterUpload"
        component={AdminMeterUpload}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterFilter"
        component={AdminMeterFilter}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterBarcode"
        component={AdminMeterBarcode}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterWriting"
        component={AdminMeterWriting}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterDetail"
        component={AdminMeterDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterHistory"
        component={AdminMeterHistory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterSearchDashboard"
        component={AdminMeterSearchDashboard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterRead"
        component={AdminMeterRead}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminMeterUnread"
        component={AdminMeterUnread}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminHelpdeskDashboard"
        component={AdminHelpdeskDashboard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminHelpdeskForm"
        component={AdminHelpdeskForm}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminHelpdeskList"
        component={AdminHelpdeskList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminHelpdeskShow"
        component={AdminHelpdeskShow}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminHelpdeskEngineer"
        component={AdminHelpdeskEngineer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminHelpdeskCategory"
        component={AdminHelpdeskCategory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminHelpdeskPriority"
        component={AdminHelpdeskPriority}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminHelpdeskType"
        component={AdminHelpdeskType}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminHelpdeskActivity"
        component={AdminHelpdeskActivity}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WorkArea"
        component={WorkArea}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminSPL"
        component={AdminSPL}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RequestSPL"
        component={RequestSPL}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ListSPL"
        component={ListSPL}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ListApprovalSPL"
        component={ListApprovalSPL}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FormApprovalSPL"
        component={FormApprovalSPL}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ShowSPL"
        component={ShowSPL}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HistorySPL"
        component={HistorySPL}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FormArea"
        component={FormArea}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminAssignment"
        component={AdminAssignment}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventifPhotoBefore"
        component={AdminPreventifPhotoBefore}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventifListChecklist"
        component={AdminPreventifListChecklist}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventifListCheckStandart"
        component={AdminPreventifListCheckStandart}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminSPVPreventifApproval"
        component={AdminSPVPreventifApproval}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventifShow"
        component={AdminPreventifShow}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventif"
        component={AdminPreventif}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventifListHistory"
        component={AdminPreventifListHistory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventiveDashboard"
        component={AdminPreventiveDashboard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PreventiveCheckStandart"
        component={PreventiveCheckStandart}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventifListShowChecklist"
        component={AdminPreventifListShowChecklist}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventifListShowCheckStandart"
        component={AdminPreventifListShowCheckStandart}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventifListShowHistoryChecklist"
        component={AdminPreventifListShowHistoryChecklist}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventiveAssignment"
        component={AdminPreventiveAssignment}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminPreventiveAssetHistory"
        component={AdminPreventiveAssetHistory}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default Router;
