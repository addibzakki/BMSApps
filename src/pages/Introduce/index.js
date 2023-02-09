import React from 'react';
import {
    View,
    Text,
    Image,
    StatusBar
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { firstIllustration, secondIllustration, thirdIllustration } from '../../assets';
import { useDispatch } from 'react-redux';
import { setIntro } from '../../redux';

const slides = [{
        key: 'one',
        title: 'LOGISTICS',
        text: 'Bagian standar dari teks Lorem Ipsum yang digunakan sejak tahun 1500an kini di reproduksi kembali di bawah ini untuk mereka yang tertarik. Bagian 1.10.32 dan 1.10.33 dari "de Finibus Bonorum et Malorum" karya Cicero juga di reproduksi persis seperti bentuk aslinya, diikuti oleh versi bahasa Inggris yang berasal dari terjemahan tahun 1914 oleh H. Rackham.',
        image: firstIllustration,
        backgroundColor: '#59b2ab',
    },
    {
        key: 'two',
        title: 'INTEGRATED',
        text: 'Bagian standar dari teks Lorem Ipsum yang digunakan sejak tahun 1500an kini di reproduksi kembali di bawah ini untuk mereka yang tertarik. Bagian 1.10.32 dan 1.10.33 dari "de Finibus Bonorum et Malorum" karya Cicero juga di reproduksi persis seperti bentuk aslinya, diikuti oleh versi bahasa Inggris yang berasal dari terjemahan tahun 1914 oleh H. Rackham.',
        image: secondIllustration,
        backgroundColor: '#febe29',
    },
    {
        key: 'three',
        title: 'EXTRA SPACE',
        text: 'Bagian standar dari teks Lorem Ipsum yang digunakan sejak tahun 1500an kini di reproduksi kembali di bawah ini untuk mereka yang tertarik. Bagian 1.10.32 dan 1.10.33 dari "de Finibus Bonorum et Malorum" karya Cicero juga di reproduksi persis seperti bentuk aslinya, diikuti oleh versi bahasa Inggris yang berasal dari terjemahan tahun 1914 oleh H. Rackham.',
        image: thirdIllustration,
        backgroundColor: '#22bcb5',
    }
];


const Introduce = ({navigation}) => {
    const dispatch = useDispatch();

    const renderItem = ({ item }) => {
        return (
            <View style = {
                {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: item.backgroundColor,
                    padding: 15
                }
            }>
                <Image source={item.image} resizeMethod='resize' resizeMode='center' style={{height:400, width: 400}} />
                <Text style = {
                    {
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#424242',
                        marginVertical: 10
                    }
                }> 
                {
                    item.title
                } 
                </Text>
                <Text style = {
                    {
                        textAlign: 'center',
                        fontSize: 14,
                        color: '#424242'
                    }
                }> 
                {
                    item.text
                } 
                </Text>
            </View>
        );
    }
    
    const onDone = () => {
        dispatch(setIntro());
        navigation.replace('Login');
    }
    return (
        <View style={{flex: 1}}>
            <StatusBar translucent backgroundColor="transparent" />
            <AppIntroSlider
            renderItem = {
                renderItem
            }
            data = {
                slides
            }
            onDone = {
                onDone
            }
            showSkipButton = {false}
            />
        </View>
        );
}

export default Introduce;