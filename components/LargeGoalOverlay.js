import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import GoalItem from './GoalItem';
import { Overlay } from 'react-native-elements';


const notePress = () => {
  console.log("Press")
}

// const [showOverlay, setShowOverlay] = useState(false);


const LargeGoalOverview = ({ xOut, goal }) => (


  <View>
    {/* Top half */}
    <View style={{ borderBottomWidth: 1, padding: 10, borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center' }}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity style={{}} >
          <Text>SAVE</Text>
        </TouchableOpacity>

        {/* Title Container */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20 }}>The Goal</Text>
        </View>

        <TouchableOpacity style={{}} onPress={() => xOut()}>
          <FontAwesome5 name="times" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <Text>Milestones</Text>
      {/* <Text>Milestones - title -{goal.title}</Text> */}
      <GoalItem goalData={goal} />

      {/* Milestone rectangles */}
      <View style={{ marginTop: 10 }}>
        <View style={[reusableStyles.button, { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "white", padding: 10, borderColor: "#000", borderWidth: 2, }]}>
          <Text>Started the goal</Text>
          <Text>{goal.date.toLocaleDateString('en-GB')}</Text>
        </View>
      </View>
    </View>
    {/* Notes */}
    <View style={{ borderBottomWidth: 1, padding: 10, borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notes</Text>
      <TouchableOpacity style={[reusableStyles.button, { backgroundColor: "white", padding: 10, borderColor: "#000", borderWidth: 2, height: 'auto' }]} onPress={notePress}>

        <Text>Started the goal Started the goal Started the goal Started the goal Started the goal Started the g Started the goal Started the goal Started the goaloal</Text>
        <Text style={{alignSelf: 'flex-end', marginRight: 10}}>xx/xx/xx</Text>
      </TouchableOpacity>
    </View>
    {/* Buttons */}
  <TouchableOpacity style={[reusableStyles.button, { backgroundColor: "white", padding: 10, borderColor: "#000", borderWidth: 2, height: 'auto' }]}>
    <Text>Add a milestone</Text>
  </TouchableOpacity>
  <TouchableOpacity style={[reusableStyles.button, { backgroundColor: "white", padding: 10, borderColor: "#000", borderWidth: 2, height: 'auto' }]}>
  <Text>Add a note</Text>
  </TouchableOpacity>

  </View>
);



export default LargeGoalOverview;