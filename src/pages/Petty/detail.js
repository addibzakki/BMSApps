import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Alert, FlatList, RefreshControl } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch, useSelector } from 'react-redux';
import { Footer, FooterTab, Button, ListItem, Left, Body } from 'native-base';
import {
    TopHeader,
    TextLineIndent,
    TextLineIndentLight,
    SkeletonFakeList,
} from '../../component';
import { cm_style, global_style } from '../Admin/Assignment/Corrective/Styles';
import {
    setRefresh,
    setLoading,
} from '../../redux';
import { colorLogo } from '../../utils';
import { RFPercentage } from 'react-native-responsive-fontsize';
import PettyLAPIService from '../../services/Petty/PettyAPIService';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const PettyDetail = ({ route, navigation }) => {
    console.log('On Page Show Detail Petty');
    console.log(route.params);
    const dispatch = useDispatch();
    const LoginReducer = useSelector(state => state.LoginReducer);
    const GlobalReducer = useSelector(state => state.GlobalReducer);
    const [dataHeader, setDataHeader] = useState([]);
    const [dataDetail, setDataDetail] = useState([]);
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
                doc_no: route.params.doc_no
            };
            const res = await PettyLAPIService.getDetail(
                params,
            );

            setDataHeader(res.data.header);
            setDataDetail(res.data.data);
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
        item.data = route.params;
        return (
            
                <ListItem
                    style={{
                    borderWidth: 1,
                    marginLeft: 0,
                    borderRadius: 10,
                    marginBottom: 5,
                    }}
                    avatar
                    onPress={() => navigation.navigate('PettyShowCapture', item)}>
                <Left
                    style={{
                        backgroundColor: (item.is_balance == 'Y' ? 'red' : 'green') ,
                        height: '100%',
                        alignItems: 'center',
                        paddingTop: 0,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                    }}>
                    <View>
                        <IconMaterial
                            active
                            name={(item.is_balance == 'Y' ? 'cash-refund' : 'cash-plus')}
                            style={{ fontSize: 18, paddingHorizontal: 5, fontWeight: 'bold' }}
                            color="white"
                        />
                    </View>
                </Left>
                    <Body>
                        <TextLineIndentLight label="Desc" value={item.descs} />
                        <TextLineIndentLight label="Price" value={item.amount} />
                        <TextLineIndentLight
                            label="Date"
                            value={moment(item.created_at).format('DD MMMM YYYY')}
                        />
                        <TextLineIndentLight label="Type" value={(item.is_balance == 'Y' ? 'Refund':'Purchase')} />
                    </Body>
                </ListItem>
        );
    };

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
            uploadData.append('id_admin', route.params.id_admin);
            uploadData.append('id_pic', route.params.id_pic);
            uploadData.append('id_category', route.params.id_category);
            uploadData.append('transfer_date', route.params.transfer_date);
            uploadData.append('created_by', LoginReducer.form.profile.uid);

            console.log(uploadData);
            
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
            Alert.alert('Error', error.message);
            setLoadingData(false);
        }
    };

    console.log(route.params);
    const updateSettlement = async () => {
        setLoading(true);
        try {
            let uploadData = new FormData();
            uploadData.append('id', route.params.id);
            uploadData.append('status_settle', 'S');
            uploadData.append('updated_by', LoginReducer.form.profile.uid);
            
            const res = await PettyLAPIService.updateSettlement(uploadData);
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
            Alert.alert('Error', error.message);
            setLoadingData(false);
        }
    };

    const buttonFooter = () => {
        if (route.params.status != 'P' && route.params.status_settle == null) {
            return (<View>
                <Footer>
                    <FooterTab>
                        <Button
                            info
                            full
                            onPress={() => {
                                navigation.navigate('PettyCapture', {
                                    'header': dataHeader, 'detail': dataDetail, 'entity_project': route.params.entity_project,
                                    'data': route.params
                                });
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
                                if (dataHeader.current_amount != 0) {
                                    Alert.alert('Warning', 'Sorry, you still have remaining balance (' + dataHeader.current_amount_format +') for this document number (transaction), please settle with refund type for remaining balance.');
                                }else{
                                    Alert.alert(
                                        'Attention',
                                        'Do you want to submit this settlement?', [
                                        {
                                            text: 'No',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        { text: 'Yes', onPress: () => submitSettlement() },
                                    ]
                                    );
                                }
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
            </View>);
        } else if (route.params.status == 'P' && route.params.status_settle == 'P'){
            return (<View>
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
                                    'doc_no': route.params.doc_no,
                                });
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
                                if (dataHeader.current_amount != 0) {
                                    Alert.alert('Warning', 'Sorry, you still have remaining balance (' + dataHeader.current_amount_format + ') for this document number (transaction), please settle with refund type for remaining balance.');
                                } else {
                                    Alert.alert(
                                        'Attention',
                                        'Do you want to update this settlement?', [
                                        {
                                            text: 'No',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        { text: 'Yes', onPress: () => updateSettlement() },
                                    ]
                                    );
                                }
                            }}>
                            <Text
                                style={{
                                    color: '#FFF',
                                    fontSize: RFPercentage(2),
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}>
                                Re-Submit
                            </Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </View>);
        }
    }

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
                        <TextLineIndent label="Location" value={route.params.location} />
                        <TextLineIndent label="Category" value={route.params.category_desc} />
                        <TextLineIndent label="Balance" value={dataHeader.current_amount_format} />
                        <TextLineIndent
                            label="Description"
                            value={dataHeader.descs}
                        />
                        {/* <View style={global_style.space(15)} /> */}
                        <View
                            style={{
                                borderWidth: 0.5,
                                marginVertical: 5,
                                marginHorizontal: 15,
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
                {buttonFooter()}
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
        },
    },
    space: value => {
        return {
            height: value,
        };
    },
};

export default PettyDetail;
