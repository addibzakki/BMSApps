import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../../component';


const ActionButton = ({desc, title, onPress}) => {
    return (
        <View style={{width: 225, marginBottom: 20}}>
            <Text style={{fontSize: 14, textAlign: 'center', paddingHorizontal: '15%', marginBottom: 6}}>
                {desc}
            </Text>
            <Button title={title} onPress={onPress} />
        </View>
    )
}

export default ActionButton;