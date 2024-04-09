

import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { goalMain, reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const GoalItem = ({ goalData, onItemPress, onGoalPress }) => {
    useEffect(() => {
    console.log("goalData in goalItem.")
    console.log(goalData.createdAt)
    }, [goalData]);
  
    return (
      <TouchableOpacity
        style={[reusableStyles.textInput, { height: 128, marginBottom: 10 }, reusableStyles.lessRounded]}
        onPress={() => onGoalPress(goalData)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>{goalData.goal}</Text>
          <TouchableOpacity onPress={() => onItemPress(goalData.id)} style={goalMain.settings}>
            <FontAwesome5 name="ellipsis-h" size={15} color="#000" />
          </TouchableOpacity>
        </View>
        {/* Milestones and Date */}
        <View style={goalMain.bottomBit}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#000' }}>
              Milestones: {goalData.milestones ? goalData.milestones.length : 0}
            </Text>
            <Text style={{ color: '#000' }}>{goalData.targetDate.toLocaleDateString('en-GB')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  export default GoalItem;