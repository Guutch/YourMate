import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import GoalItem from './GoalItem';
import { Overlay } from 'react-native-elements';

import NoteComponent from './NoteComponent';
import MilestoneGoal from './MilestoneGoal';

import UserModel from '../firebase/UserModel';




const LargeGoalOverview = ({ xOut, goal, onOverlayContentChange, userId }) => {

  // console.log("This is the note ")
  // console.log(goal.notes[0].createdAt)
  // console.log("This is the note ")

  console.log(goal.milestones)

  const handleMilestoneButtonPress = () => {
    // console.log("lol")
    onOverlayContentChange('milestone');
  };

  const handleNoteButtonPress = () => {
    onOverlayContentChange('note');
  };

  const handleCancel = () => {
    onOverlayContentChange('lrg');
  };

  const handleFlagPress = async (milestone, goal) => {
    console.log("milestone(((((((((((((")
    console.log(milestone)
    // const newStatus = milestone.status === 'Ongoing' ? 'Completed' : 'Ongoing';
    // const isStatusUpdated = await UserModel.updateMilestoneStatus(userId, goal.id, milestone.id, newStatus);

    // if (isStatusUpdated) {
    //     const updatedMilestones = goal.milestones.map(m => {
    //         if (m.id === milestone.id) { // Use the destructured `id` or `milestone.id`
    //             return { ...m, status: newStatus };
    //         }
    //         return m;
    //     });

    //     // Call the parent component's function to update the entire goal's milestones
    //     onUpdateGoalMilestones(goal.id, updatedMilestones);
    // } else {
    //     console.error('Error updating milestone status');
    // }
};


  const handleEllipsisPress = (milestoneTitle) => {
    // Implement your logic to show the overlay options for modifying or deleting the milestone
    onOverlayContentChange('options');
  };

  return (
    <ScrollView>
      {/* Top half */}
      <View style={{ borderBottomWidth: 1, padding: 10, borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center' }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <View>
            <Text style={{color: "#000"}}>Goal Details</Text>
          </View>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{color: "#fff"}}>The Goal</Text>
          </View>

          <TouchableOpacity style={{}} onPress={() => xOut()}>
            <FontAwesome5 name="times" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        <Text>Milestones</Text>
        {/* <Text>Milestones - title -{goal.title} </Text>   */}
        <GoalItem goalData={goal} />

        {/* Milestone rectangles */}
        <View style={{ marginTop: 10 }}>
          <View style={{ marginTop: 10 }}>
            <View style={[reusableStyles.button, { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "white", padding: 10, borderColor: "#000", borderWidth: 2 }]}>
              <Text>Started the goal</Text>
              <Text>{goal.date.toLocaleDateString('en-GB')}</Text>
              {/* Conditionally render MilestoneGoal if milestones exist */}

            </View>
            {goal.milestones && goal.milestones.length > 0 ? (
              goal.milestones.map((milestone, index) => (
                <MilestoneGoal
                  key={index}
                  title={milestone.title}
                  onFlagPress={handleFlagPress}
                  onEllipsisPress={handleEllipsisPress}
                  milestone={milestone}
                  goal={goal}
                />
              ))
            ) : (
              <View style={{ marginVertical: 20 }}>
                <Text style={{ textAlign: 'center', color: 'black' }}>No milestones yet</Text>
              </View>

            )}
            <View style={[reusableStyles.button, { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "white", padding: 10, borderColor: "#000", borderWidth: 2 }]}>
              <Text>Target Date</Text>
              <Text>{goal.targetDate.toLocaleDateString('en-GB')}</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Notes */}
      <View style={{ borderBottomWidth: 1, padding: 10, borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Notes</Text>
        {goal.notes && goal.notes.length > 0 ? (
          goal.notes.map((note, index) => (
            <NoteComponent
              key={index}
              noteTitle={note.title}
              noteText={note.description}
              noteDate={note.createdAt.toLocaleDateString('en-GB')}
            />
          ))
        ) : (
          <Text>There are no notes.</Text>
        )}

      </View>
      {/* Buttons */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', // Center elements horizontally
        flexWrap: 'wrap',
        marginTop: 5,
        padding: 10 
       }}> 
       
    <TouchableOpacity 
        style={[
            reusableStyles.button, 
            { 
                backgroundColor: "white", 
                padding: 10, 
                borderColor: "#000", 
                borderWidth: 2,
                marginBottom: 10 // Add margin for spacing
            }
        ]} 
        onPress={handleMilestoneButtonPress}
    >
        <Text>Add a milestone</Text>
    </TouchableOpacity>

    <TouchableOpacity 
        style={[
            reusableStyles.button, 
            { 
                backgroundColor: "white", 
                padding: 10, 
                borderColor: "#000", 
                borderWidth: 2, 
                marginBottom: 10 // Add margin for spacing
            }
        ]}
        onPress={handleNoteButtonPress}
    >
        <Text>Add a note</Text>
    </TouchableOpacity>
</View>


    </ScrollView>
  );

};



export default LargeGoalOverview;