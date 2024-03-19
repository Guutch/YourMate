

import React from 'react';
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { goalMain, reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const MilestoneGoal = ({ title }) => (
    <TouchableOpacity style={[reusableStyles.button, { flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between', backgroundColor: "white", padding: 1, borderColor: "#000", borderWidth: 2, textAlign: 'centre' }]}>
        <Text>{title}</Text>
    </TouchableOpacity>
);


export default MilestoneGoal;