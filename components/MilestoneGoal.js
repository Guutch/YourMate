

import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { goalMain, reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const MilestoneGoal = ({ title, onFlagPress, onEllipsisPress, milestone, goal }) => {
  const { status } = milestone;
  console.log("status")
  console.log(status)
  const [visualStatus, setVisualStatus] = useState(milestone.status);
  const borderColor = visualStatus === 'Completed' ? 'green' : '#000';

  const handleFlagPress = () => {
    // Toggle visual status instantly for immediate feedback
    const newVisualStatus = visualStatus === 'Ongoing' ? 'Completed' : 'Ongoing';
    setVisualStatus(newVisualStatus);

    // Continue with the backend update and global state management
    onFlagPress(milestone, goal);
  };

  console.log("title!!!!!!")
  console.log(title)


  return (
    <TouchableOpacity
      style={[
        reusableStyles.button,
        {
          flexDirection: 'row',
          height: 60,
          marginVertical: 5,
          justifyContent: 'space-between',
          backgroundColor: 'white',
          padding: 10,
          borderColor,
          borderWidth: 2,
          textAlign: 'centre',
        },
      ]}
    >
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={handleFlagPress} style={[goalMain.settings, { marginRight: 5 }]}>
          <FontAwesome5 name="flag" size={15} color="#000" />
        </TouchableOpacity>
        <Text style={{ marginLeft: 5}}>{title}</Text>
      </View>
      <TouchableOpacity onPress={() => onEllipsisPress(title)} style={[goalMain.settings, { marginRight: 5 }]}>
        <FontAwesome5 name="ellipsis-h" size={15} color="#000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};


export default MilestoneGoal;