import React from 'react';
import { colorLogo } from '../../../utils';
import RadioForm from 'react-native-simple-radio-button';

export const Radio = ({list, initial, onPress}) => {
    return (
        <RadioForm
            radio_props={list}
            initial={initial}
            labelHorizontal={true}
            buttonColor={colorLogo.color3}
            selectedButtonColor={colorLogo.color3}
            labelStyle={{fontSize: 16, color: colorLogo.color3}}
            animation={true}
            buttonSize={15}
            buttonOuterSize={25}
            onPress={(value) => onPress(value)}
        />
    )
}