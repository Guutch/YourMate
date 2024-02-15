import React from 'react';
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { goalMain, reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const BlockItem = ({ title, time }) => (
    <TouchableOpacity style={[reusableStyles.textInput, { height: 68 }, reusableStyles.lessRounded]}>
        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', color: "#000", alignItems: 'center' }]}>
            <View style={{ justifyContent: 'center'}}>
            <Text>{title}</Text>
            <Text>{time}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={15} color="#000" />

        </View>
    </TouchableOpacity>
);

export default BlockItem;