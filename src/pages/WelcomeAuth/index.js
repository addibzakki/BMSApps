import React from 'react';
import { View, Image, StatusBar } from 'react-native';
import ActionButton from './ActionButton';
import { welcomeLogo } from '../../assets';
import { colors } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { setBackIntro, clearToken } from '../../redux';


const WelcomeAuth = ({navigation}) => {
    const LoginReducer = useSelector((state) => state.LoginReducer);
    const dispatch = useDispatch();

    const handleGoTo = screen => {
        dispatch(clearToken());
        navigation.navigate(screen)
    }

    const backToIntro = () => {
        dispatch(setBackIntro());
        navigation.replace('Splash');
    }

    return (
        <View style={styles.wrapper.page}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />
            <Image source={welcomeLogo} resizeMethod='resize' style={{marginBottom: 30}}/>
            <ActionButton desc="" title="enter" onPress={() => handleGoTo('AdminDashboard')} />
            {/* <ActionButton desc="Or back to introduce :" title="back" onPress={() => backToIntro()} /> */}
        </View>
    )
}

const styles = {
    wrapper: {
        page: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.default,
        }
    }
}

export default WelcomeAuth;