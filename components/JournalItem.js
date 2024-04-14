

import React from 'react';
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { goalMain, reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const JournalItem = ({ title, date, desc, item, removeJournal }) => {
    // Functions defined directly within the component
    const formatDate = (datetimeString) => {
        return datetimeString.split(',')[0];
    }

    const trimText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }

    console.log("item")
    console.log(item)

    return (
        <View style={[reusableStyles.textInput, { height: 'auto' }, reusableStyles.lessRounded]}>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', color: "#000", alignItems: 'center' }]}>
                <View style={{ justifyContent: 'center' }}>
                    <Text numberOfLines={1}>
                        Title: {title}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ paddingRight: 9 }}>
                        {formatDate(date)}
                    </Text>
                    <FontAwesome5 name="clock" size={15} color="#000" />
                </View>
            </View>
            <Text>Description: {desc}</Text>
            {/* Display additional data */}
            {item.engagedInHabit !== null && (
                <Text>Engaged in habit: {item.engagedInHabit}</Text>
            )}
            {item.madeProgress !== null && (
                <Text>Made progress: {item.madeProgress}</Text>
            )}
            {item.progressComment.trim() !== '' && (
                <Text>Progress Comment: {item.progressComment}</Text>
            )}
            {item.triggerComment.trim() !== '' && (
                <Text>Trigger Comment: {item.triggerComment}</Text>
            )}
            {item.triggeredToday !== null && (
                <Text>Triggered today: {item.triggeredToday}</Text>
            )}
            <TouchableOpacity
                style={{ position: 'absolute', bottom: 5, right: 5 }}
                onPress={() => removeJournal(item)}
            >
                <FontAwesome5 name="times" size={15} color="red" />
            </TouchableOpacity>

        </View>
    );
};

export default JournalItem;