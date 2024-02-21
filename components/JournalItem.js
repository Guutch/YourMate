

import React from 'react';
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { goalMain, reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

function formatDate(datetimeString) {
    // Split the string by comma and return the first part (the date)
    return datetimeString.split(',')[0];
}
function trimText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}


const JournalItem = ({ title, date, desc }) => (

    // const formattedDate

    <TouchableOpacity style={[reusableStyles.textInput, { height: 68 }, reusableStyles.lessRounded]}>


        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', color: "#000", alignItems: 'center' }]}>
            <View style={{ justifyContent: 'center' }}>
                <Text numberOfLines={1}>
                    {trimText(title, 20)} {/* Trim at 30 characters */}
                </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Text style={{ paddingRight: 9 }}>
                    {formatDate(date)}
                </Text>

                <FontAwesome5 name="clock" size={15} color="#000" />
            </View>


        </View>
        <Text numberOfLines={1}>{desc}</Text>
    </TouchableOpacity>
);

export default JournalItem;