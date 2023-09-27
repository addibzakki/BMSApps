import React, {useRef, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './router';
import {Provider} from 'react-redux';
import {store} from './redux';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/es/integration/react';
import {
  LogBox,
  View,
  Text,
  AppState,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {colorLogo} from './utils';
import {openDatabase} from 'react-native-sqlite-storage';
import {uploadPendingTables} from './component';
import NetInfo from '@react-native-community/netinfo';
import GlobalContext from './component/GlobalContext';
import GPSState from 'react-native-gps-state';
import OneSignal from 'react-native-onesignal';
import linking from './linking';
import {MenuProvider} from 'react-native-popup-menu';

global.db = openDatabase({name: 'bmsDatabase.db'});

// remove when fixing
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'componentWillReceiveProps',
  'Invalid prop `children` of type `object` supplied to `DialogActionList`, expected an array',
  'Warning',
  'Non-serializable values were found in the navigation state',
]);
// remove when fixing

const peristedStore = persistStore(store);
const requestPermission = async () => {
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ]);
};

const App = () => {
  requestPermission();
  const [networkInfo, setNetworkInfo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [refreshKey, setRefreshKey] = useState(false);

  useEffect(() => {
    //OneSignal Init Code
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId('7f592ae2-08a9-4c0e-83dd-f3955bf1128e');
    //END OneSignal Init Code

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('OneSignal: notification opened:', notification);
    });

    // cek koneksi
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkInfo(state.isConnected);
    });

    // cek show apps
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    GPSState.addListener(status => {
      switch (status) {
        case GPSState.RESTRICTED:
          Alert.alert(
            'Attention',
            'This app wants to change your device settings : Use GPS, Wi-Fi, and cell network for location',
            [{text: 'Ok', onPress: () => GPSState.openLocationSettings()}],
          );
          break;
      }
    });

    return () => {
      unsubscribe();
      GPSState.removeListener();
    };
  }, []);

  if (appStateVisible === 'background') {
    uploadPendingTables(db);
  }

  const globalState = {
    networkInfo: networkInfo,
    loading: loading,
    setLoading: setLoading,
    loadingSubmit: loadingSubmit,
    setLoadingSubmit: setLoadingSubmit,
  };
  return (
    <Provider store={store}>
      <PersistGate persistor={peristedStore} loading={null}>
        <NavigationContainer linking={linking}>
          <GlobalContext.Provider value={globalState}>
            {networkInfo == false && (
              <View
                style={{
                  backgroundColor: colorLogo.color1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 5,
                }}>
                <Text style={{color: 'white'}}>Your connection is lost!</Text>
              </View>
            )}
            <MenuProvider>
              <Router />
            </MenuProvider>
          </GlobalContext.Provider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
