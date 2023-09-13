import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Alert, Image, FlatList, RefreshControl } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch, useSelector } from 'react-redux';
import { Footer, FooterTab, Button, ListItem, Left, Body, Right } from 'native-base';
import {
    TopHeader,
    TextLineIndent,
    ButtonActionShow,
    ListAttachment,
    ListAssignment,
    TextLineIndentLight,
    SkeletonFakeList,
} from '../../component';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { cm_style, global_style } from '../Admin/Assignment/Corrective/Styles';
import { CorrectiveAPIService } from '../../services';
import {
    setPicStatusCorrective,
    setRefresh,
    setLoading,
} from '../../redux';
import { colorLogo } from '../../utils';
import { RFPercentage } from 'react-native-responsive-fontsize';
import PettyLAPIService from '../../services/Petty/PettyAPIService';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const PettyDetail = ({ route, navigation }) => {
    console.log(route.params)
    console.log('On Page Show Detail Petty');
    const dispatch = useDispatch();
    const LoginReducer = useSelector(state => state.LoginReducer);
    const CorrectiveReducer = useSelector(state => state.CorrectiveReducer);
    const GlobalReducer = useSelector(state => state.GlobalReducer);
    const [image, setImage] = useState([]);
    const [dataSpv, setDataSpv] = useState([]);
    const [dataHeader, setDataHeader] = useState([]);
    const [dataDetail, setDataDetail] = useState([]);
    const [dataEngineer, setDataEngineer] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        // when refresh : true
        if (GlobalReducer.refresh === true) {
            getData();
        }
        // when focused : true
        const unsubscribe = navigation.addListener('focus', () => {
            getData();
        });
        return unsubscribe;
    }, [navigation, GlobalReducer.refresh === true]);

    const getData = async () => {
        try {
            const params = {
                entity_project: route.params.entity_project,
                project_no: route.params.project_no,
                bank_cd: route.params.bank_cd,
                doc_no: route.params.doc_no
            };
            const res = await PettyLAPIService.getDetail(
                params,
            );

            setDataHeader(res.data.header);
            setDataDetail(res.data.data);
            console.log(dataHeader);
            console.log(dataDetail);
            dispatch(setRefresh(false));
            dispatch(setLoading(false));
            setLoadingData(false);
        } catch (error) {
            Alert.alert('Error', error.message);
            dispatch(setRefresh(false));
            dispatch(setLoading(false));
            setLoadingData(false);
        }
    };

    const renderItem = ({ item, index }) => {
        console.log(item);
        return (
            
                <ListItem
                    style={{
                        marginLeft: 0,
                        marginBottom: 5,
                    }}
                    avatar
                    onPress={() => navigation.navigate('PettyShowCapture', item)}>

                    <Body>
                        <TextLineIndentLight label="Desc" value={item.descs} />
                        <TextLineIndentLight label="Price" value={item.amount} />
                        <TextLineIndentLight
                            label="Date"
                            value={moment(item.created_at).format('DD MMMM YYYY')}
                        />
                    </Body>
                    {/* <Right style={{
                        height: '100%',
                        alignItems: 'center',
                        // paddingTop: 0,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                    }}>
                        <View>
                            <Image
                                source={require('../../assets/illustration/add_photo.png')}
                                style={{
                                    height: 50,
                                    width: 50,
                                    opacity: 0.3,
                                }}
                                resizeMethod="resize"
                            />
                        </View>
                    </Right> */}
                </ListItem>
        );
    };

    // const renderEmpty = () => {
    //     return (
    //         <View
    //             style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
    //             <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
    //                 NOTHING SETTLEMENT
    //             </Text>
    //         </View>
    //     );
    // };

    const content = () => {
        if (loadingData == true) {
            return <SkeletonFakeList row={4} height={50} />;
        } else {
            return (
                <FlatList
                    removeClippedSubviews={false}
                    data={dataDetail}
                    renderItem={renderItem}
                    // ListEmptyComponent={renderEmpty()}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={GlobalReducer.refresh}
                            onRefresh={() => dispatch(setRefresh(true))}
                        />
                    }
                />
            );
        }
    };

    

    const submitSettlement = async () => {
        setLoading(true);
        try {
            let uploadData = new FormData();
            uploadData.append('entity_project', dataHeader.entity_project);
            uploadData.append('project_no', dataHeader.project_no);
            uploadData.append('bank_cd', dataHeader.bank_cd);
            uploadData.append('doc_no', dataHeader.doc_no);
            uploadData.append('descs', dataHeader.descs);
            uploadData.append('created_by', LoginReducer.form.profile.uid);
            
            const res = await PettyLAPIService.submitSettlement(uploadData);
            if (res.data.code == 200) {
                Alert.alert(
                    'Success',
                    res.data.message,
                    [
                        { text: 'Ok', onPress: () => navigation.replace('PettyDashboard') },
                    ],
                );
                setLoadingData(false);
            } else {
                Alert.alert('Error', res.data.message);
                setLoadingData(false);
            }
        } catch (error) {
            // inputTablesLog(db, data, 'bms_meter_log', 'error connection');
            // console.log(error);
            Alert.alert('Error', error.message);
            setLoadingData(false);
        }
    };

    return (
        <View style={global_style.page}>
            <Spinner
                visible={loadingData}
                textContent={'Loading data...'}
                textStyle={{ color: '#FFF' }}
                overlayColor={'rgba(0, 0, 0, 0.60)'}
            />
            <TopHeader
                title="Settlement"
                subTitle={'#' + route.params.doc_no}
                onPress={() => navigation.goBack()}
                onPressHome={() => navigation.navigate('AdminDashboard')}
            />
            <View style={cm_style.subPage}>
                <ScrollView>
                    <View>
                        <View style={global_style.space(10)} />
                        <TextLineIndent label="Amount Transfer" value={dataHeader.balance_format} />
                        <TextLineIndent label="Balance" value={dataHeader.current_amount_format} />
                        <TextLineIndent
                            label="Description"
                            value={dataHeader.descs}
                        />
                        <View style={global_style.space(15)} />
                        <View
                            style={{
                                borderWidth: 0.5,
                                marginVertical: 5,
                                marginHorizontal: 20,
                                borderColor: colorLogo.color4,
                            }}
                        />
                        <View style={global_style.space(15)} />
                        <View style={styles.wrapper.menu}>
                            {content()}
                        </View>
                    </View>
                </ScrollView>
                <View style={global_style.space(50)} />
                <View>
                    <Footer>
                        <FooterTab>
                            <Button
                                info
                                full
                                onPress={() => {
                                    navigation.navigate('PettyCapture', {
                                        'header': dataHeader, 'detail': dataDetail, 'entity_project': route.params.entity_project,
                                        'project_no': route.params.project_no,
                                        'bank_cd': route.params.bank_cd,
                                        'doc_no': route.params.doc_no });
                                }}>
                                <Text
                                    style={{
                                        color: '#FFF',
                                        fontSize: RFPercentage(2),
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}>
                                    Capture
                                </Text>
                            </Button>
                            <Button
                                primary
                                full
                                onPress={() => {
                                    Alert.alert(
                                        'Attention',
                                        'Do you want to submit this settlement?',[
                                            {
                                                text: 'No',
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel',
                                            },
                                            { text: 'Yes', onPress: () => submitSettlement() },
                                        ]
                                    );
                                }}>
                                <Text
                                    style={{
                                        color: '#FFF',
                                        fontSize: RFPercentage(2),
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}>
                                    Submit
                                </Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </View>
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
        subPage: {
            flex: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'white',
            paddingTop: 5,
        },
        menu: {
            marginHorizontal: 10,
            borderWidth: 1, 
            borderRadius: 10,
            borderColor: colorLogo.color4
        },
    },
    space: value => {
        return {
            height: value,
        };
    },
};

export default PettyDetail;
