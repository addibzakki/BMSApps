import React, { useState} from "react";
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { Item, Input, Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { InputDateRangeFilter } from "../Input";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export const Filter = () => {
    const [startTime, setStartTime] = useState(moment().toDate());
    const [endTime, setEndTime] = useState(moment().toDate());
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);

    const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate || startTime;
        setShowStart(Platform.OS === 'ios');
        setStartTime(currentDate);
    };

    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate || endTime;
        setShowEnd(Platform.OS === 'ios');
        setEndTime(currentDate);
    };

    return (
        <View style={{paddingHorizontal: 15}}>
            <View style={{marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                    <InputDateRangeFilter placeholder='DD-MM-YYYY' value={(startTime ? moment(startTime).format('DD-MM-YYYY') : '')} editable={false} onPress={() => setShowStart(true)}/>
                    {showStart && (
                                <DateTimePicker
                                    testID="startTimePicker"
                                    value={startTime}
                                    mode='calendar'
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChangeStart}
                                />)
                            }
                </View>
                <View style={{justifyContent: 'center', alignContent: 'center', marginHorizontal: 5}}>
                    <Ionicons name='arrow-forward-sharp' size={20} />
                </View>
                <View style={{flex: 1}}>
                    <InputDateRangeFilter placeholder='DD-MM-YYYY' value={(endTime ? moment(endTime).format('DD-MM-YYYY') : '')} editable={false} onPress={() => setShowEnd(true)}/>
                    {showEnd && (
                                <DateTimePicker
                                    testID="endTimePicker"
                                    value={endTime}
                                    mode='calendar'
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChangeEnd}
                                />)
                            }
                </View>
            </View>
            
            <View style={{flexDirection: 'row', marginBottom: 10}}>
                <TouchableOpacity style={{backgroundColor: 'green', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginRight: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons name='md-checkmark-outline' size={15} color='white' /><Text style={{color: 'white', fontWeight: 'bold', textTransform: 'uppercase'}}> Set Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: 'blue', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginRight: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons name='md-document-text-outline' size={15} color='white' /><Text style={{color: 'white', fontWeight: 'bold', textTransform: 'uppercase'}}>Send Report</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, marginRight: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons name='md-close-outline' size={15} color='white' /><Text style={{color: 'white', fontWeight: 'bold', textTransform: 'uppercase'}}>Cancel</Text>
                </TouchableOpacity>
            </View>
            
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={{backgroundColor: 'red', padding: 5, borderRadius: 10, marginRight: 5}}>
                    <Ionicons name='options-outline' size={25} color='white' />
                </TouchableOpacity>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity style={{backgroundColor: 'blue', paddingHorizontal: 10, borderRadius: 10, marginRight: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontWeight: 'bold', textTransform: 'uppercase'}}>Awaiting Approval</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: 'blue', paddingHorizontal: 10, borderRadius: 10, marginRight: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontWeight: 'bold', textTransform: 'uppercase'}}>Request Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: 'blue', paddingHorizontal: 10, borderRadius: 10, marginRight: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontWeight: 'bold', textTransform: 'uppercase'}}>Approved</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}
