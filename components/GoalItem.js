

import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { goalMain, reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const GoalItem = ({ goalData, onItemPress, onGoalPress, deeperLook, isCompleted }) => {
  console.log("GOALDATA")
  console.log(goalData)
  return (
    <>
      {deeperLook === false ? (
        <TouchableOpacity
          style={[reusableStyles.textInput, { height: 128, marginBottom: 10 }, reusableStyles.lessRounded]}
          onPress={() => onGoalPress(goalData)}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ color: '#000' }}>Title: {goalData.goal}</Text>
              {goalData.startingValue !== "" && (
                <Text style={{ color: '#000' }}>
                  Starting Value: {goalData.startingValue}
                </Text>
              )}
              {goalData.numericalTarget !== "" && (
                <Text style={{ color: '#000' }}>
                  Target Value: {goalData.numericalTarget}
                </Text>
              )}
              {goalData.unit !== "" && (
                <Text style={{ color: '#000' }}>
                  Unit: {goalData.unit}
                </Text>
              )}
            </View>

            <TouchableOpacity onPress={() => onItemPress(goalData, isCompleted)} style={[goalMain.settings, { height: 30, width: 30 }]}>
              <FontAwesome5 name="ellipsis-h" size={15} color="#000" />
            </TouchableOpacity>
          </View>
          {/* Milestones and Date */}
          <View style={goalMain.bottomBit}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#000' }}>
                Milestones: {goalData.milestones ? goalData.milestones.length : 0}
              </Text>
              <Text style={{ color: '#000' }}>Target Date: {goalData.targetDate.toLocaleDateString('en-GB')}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[reusableStyles.textInput, { height: 128, marginBottom: 10 }, reusableStyles.lessRounded]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{goalData.goal}</Text>
            {deeperLook === false && (
              <TouchableOpacity onPress={() => onItemPress(goalData.id)} style={goalMain.settings}>
                <FontAwesome5 name="ellipsis-h" size={15} color="#000" />
              </TouchableOpacity>
            )}
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
        </View>
      )}
    </>
  );
};

export default GoalItem;