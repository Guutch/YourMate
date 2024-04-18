import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import GoalItem from './GoalItem';
import { Overlay } from 'react-native-elements';

import NoteComponent from './NoteComponent';
import MilestoneGoal from './MilestoneGoal';

import UserModel from '../firebase/UserModel';




const LargeGoalOverview = ({ xOut, goal, onOverlayContentChange, userId, updateGoalData }) => {

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


  const handleFlagPress = async (milestone, goal) => {
    try {

      const newStatus = milestone.status === 'Ongoing' ? 'Completed' : 'Ongoing';
      console.log("New status = ", newStatus);

      // Ensure database update is successful
      const isStatusUpdated = await UserModel.updateMilestoneStatus(userId, goal, milestone, newStatus);

      if (isStatusUpdated) {
        const goalMilestones = goal.milestones;
        for (let i = 0; i < goalMilestones.length; i++) {
          if (goalMilestones[i].id === milestone.id) {
            goalMilestones[i].status = newStatus;
            break; // Assuming milestone IDs are unique
          }
        }

        // Call the parent component's function 
        onUpdateGoalMilestones(goal.id, goalMilestones);
      } else {
        console.error('Error updating milestone status');
      }
    } catch (error) {

    }

  };



  const handleDeleteMilestone = async (milestone) => {
    console.log("Here")
    // 1. Remove from the frontend
    const updatedGoal = {
      ...goal,
      milestones: goal.milestones.filter((m) => m !== milestone),
    };
    updateGoalData(updatedGoal);

    // 2. Remove from the backend
    const goalId = goal.id; // Assuming `goal` has an `id` property
    const isDeleted = await UserModel.deleteMilestoneFromBackend(userId, goalId, milestone);
    if (!isDeleted) {
      console.log('Error deleting milestone from backend');
    }
  };

  const handleDeleteNote = async (note) => {
    console.log("note")
    console.log(note)
    // 1. Remove from the frontend
    const updatedGoal = {
      ...goal,
      notes: goal.notes.filter((n) => n !== note),
    };
    updateGoalData(updatedGoal);

    // 2. Remove from the backend
    const goalId = goal.id; // Assuming `goal` has an `id` property
    const isDeleted = await UserModel.deleteNoteFromBackend(userId, goalId, note);
    if (!isDeleted) {
      console.log('Error deleting note from backend');
    }
  };

  return (
    <ScrollView>
      {/* Top half */}
      <View style={{ borderBottomWidth: 1, padding: 10, borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center' }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <View>
            <Text style={{ color: "#000", fontWeight: 'bold' }}>Goal Details</Text>
          </View>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: "#fff" }}>The Goal</Text>
          </View>

          <TouchableOpacity onPress={() => xOut()}>
            <FontAwesome5 name="times" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={{ color: "#000", fontWeight: 'bold', marginBottom: 9 }}>Milestones</Text>
        {/* <Text>Milestones - title -{goal.title} </Text>   */}
        <GoalItem goalData={goal} deeperLook={true} />

        {/* Milestone rectangles */}
        <View style={{ marginTop: 10 }}>
          <View style={{ marginTop: 10 }}>
            <View style={[reusableStyles.button, { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "white", padding: 10, borderColor: "#000", borderWidth: 2 }]}>
              <Text style={{color: '#000'}}>Started the goal</Text>
              <Text style={{color: '#000'}}>{goal.date.toLocaleDateString('en-GB')}</Text>
              {/* Conditionally render MilestoneGoal if milestones exist */}

            </View>
            {goal.milestones && goal.milestones.length > 0 ? (
              goal.milestones.map((milestone, index) => (
                <MilestoneGoal
                  key={index}
                  title={milestone.title}
                  onFlagPress={handleFlagPress}
                  onDeletePress={handleDeleteMilestone}
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
              <Text style={{color: '#000'}}>Target Date</Text>
              <Text style={{color: '#000'}}>{goal.targetDate.toLocaleDateString('en-GB')}</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Notes */}
      <View style={{ borderBottomWidth: 1, padding: 10, borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{color: '#000', fontWeight: 'bold'}}>Notes</Text>
        {goal.notes && goal.notes.length > 0 ? (
          goal.notes.map((note, index) => (
            <NoteComponent
              key={index}
              noteTitle={note.title}
              noteText={note.description}
              noteDate={note.createdAt.toLocaleDateString('en-GB')}
              onDeletePress={() => handleDeleteNote(note)}
            />
          ))
        ) : (
          <Text style={{color: '#000'}}>There are no notes.</Text>
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
          <Text style={{ color: '#000' }}>Add a milestone</Text>
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
          <Text style={{ color: '#000' }}>Add a note</Text>
        </TouchableOpacity>
      </View>


    </ScrollView>
  );

};



export default LargeGoalOverview;