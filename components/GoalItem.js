

import React from 'react';
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { goalMain, reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const GoalItem = ({ goalData, onItemPress, onGoalPress }) => (
    <TouchableOpacity style={[reusableStyles.textInput, { height: 128 }, reusableStyles.lessRounded]}  onPress={() => onGoalPress(goalData)}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text >{goalData.title}</Text>
            <TouchableOpacity onPress={onItemPress} style={goalMain.settings}>
                <FontAwesome5 name="ellipsis-h" size={15} color="#000" />
            </TouchableOpacity>

        </View>
        {/* Milestones and Date */}
        <View style={goalMain.bottomBit}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#000' }}>Milestones: 0/0</Text>
                <Text style={{ color: '#000' }}>28/01/24</Text>
            </View>

        </View>
    </TouchableOpacity>
);

export default GoalItem;