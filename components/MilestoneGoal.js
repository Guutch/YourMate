

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

  console.log("MILESTONE!!!!!!")
  console.log(milestone)


  return (
    <TouchableOpacity
      style={[
        reusableStyles.button,
        {
          flexDirection: 'row',
          height: 'auto',
          marginVertical: 5,
          justifyContent: 'space-between',
          backgroundColor: 'white',
          padding: 12,
          borderColor,
          borderWidth: 2,
          textAlign: 'centre',
        },
      ]}
    >
      <View style={{ flexDirection: 'row' }}>
    <View style={{ marginLeft: 5, flex: 3 }}> 
        <Text>Title: {title}</Text>
        <Text>Desc:Desc:Desc:Desc:Desc:Desc:Desc:Desc:Desc:Desc:Desc:Desc:Desc:Desc:Desc:Desc:Desc:Desc:v {milestone.description}</Text>
    </View>

    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}> 
        <TouchableOpacity onPress={handleFlagPress} style={[goalMain.settings, { marginRight: 5, height: 30, width: 30 }]}>
            <FontAwesome5 name="flag" size={15} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEllipsisPress(title)} style={goalMain.settings}>
            <FontAwesome5 name="ellipsis-h" size={15} color="#000" />
        </TouchableOpacity>
     </View>
</View>

    </TouchableOpacity>
  );
};


export default MilestoneGoal;