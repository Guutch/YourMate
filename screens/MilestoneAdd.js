import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, landing, signUp } from '../components/styles'; // Adjust the path
import { setJustCreatedGoal, setJustCreatedM } from '../components/GoalStore'

import UserModel from '../firebase/UserModel';
import { app } from '../firebase/firebase'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
const auth = getAuth(app);
const MilestoneAdd = ({ navigation, route }) => {
  const { goal, fromMain, selected, goalId } = route.params;
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneTV, setMilestoneTV] = useState('');
  const [milestoneU, setMilestoneU] = useState('');
  const [milestoneTU, setMilestoneTU] = useState('');
  const [showValidationError, setShowValidationError] = useState(false);

  // Allows for the goal to be created on the UI
  // setGlobalData({title: goal});
  setJustCreatedGoal(true)

  console.log("goalId")
  console.log(goalId)

  console.log("fromMain")
  console.log(fromMain)

  const handleMilestoneSave = async () => {
    console.log(milestoneTitle)
    console.log(milestoneDesc)
    if (milestoneTitle.trim() === '' || milestoneDesc.trim() === '') {
      setShowValidationError(true);
    } else {
      // Perform your save operation here
      setShowValidationError(false);
    }



    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;

        console.log(milestoneTitle)

        const milestoneData = {
          title: milestoneTitle, // Use the values from your state variables
          description: milestoneDesc,
          milestoneTV: milestoneTV,
          milestoneU: milestoneU,
          milestoneTU: milestoneTU,
          status: 'Ongoing'
        };

        console.log(milestoneData)

        await UserModel.addMilestone(userId, goalId, milestoneData);
        setJustCreatedM(true)

        //   Navigate to the next screen after saving the goal
        navigation.navigate(
          fromMain ? 'MainFlow' : 'Housekeeping',
          {
            fromMain: fromMain, // Ensure the key matches what you access in MilestoneAdd
            addGoal: true,
            word: 'YourWordHeree',
            selected
          })
      } else {
        console.error('User not authenticated');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      // Handle error
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => handleMilestoneSave()}
            // onPress={test}
            // onPress={() => navigation.navigate(
            //   fromMain ? 'MainFlow' : 'Housekeeping', 
            //   { 
            //     fromMain: fromMain, // Ensure the key matches what you access in MilestoneAdd
            //     addGoal: true,
            //     word: 'YourWordHeree',
            //   }
            // )}
            style={{ padding: 10, borderRadius: 5 }}
          >
            <Text style={{ color: 'Black', textAlign: 'center', fontSize: 16 }}>
              {fromMain ? 'Add' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });


  }, [navigation, milestoneTitle, milestoneDesc, milestoneTV, milestoneU, milestoneTU]);

  const handleTitleChange = (text) => {
    setMilestoneTitle(text);
    if (text.trim() !== '' || milestoneDesc.trim() !== '') {
      setShowValidationError(false);
    }
  };

  const handleDescChange = (text) => {
    setMilestoneDesc(text);
    if (text.trim() !== '' || milestoneTitle.trim() !== '') {
      setShowValidationError(false);
    }
  };

  return (
    <View style={[reusableStyles.container]}>
      {/* Header Text */}
      <Text style={[reusableStyles.headerText, { marginBottom: 9 }]}>
        Add Milestone
      </Text>
      <Text>Required</Text>
      <TextInput style={[reusableStyles.textInput, , { height: 44, borderColor: 'black', borderWidth: 1, marginTop: 9 }, reusableStyles.lessRounded]}
        placeholder={"Title"}
        onChangeText={handleTitleChange}

      >

      </TextInput>
      <TextInput style={[reusableStyles.textInput, { height: 44, borderColor: 'black', borderWidth: 1, marginTop: 18 }, reusableStyles.lessRounded]}
        placeholder={"Description"}
        onChangeText={handleDescChange}
        multiline
      >
      </TextInput>

      <Text>Optional</Text>
      <TextInput style={[reusableStyles.textInput, { height: 44, borderColor: 'black', borderWidth: 1, marginTop: 18 }, reusableStyles.lessRounded]}
        placeholder={"Target Value"}
        onChangeText={(text) => setMilestoneTV(text)}
      >

      </TextInput>
      <TextInput style={[reusableStyles.textInput, { height: 44, borderColor: 'black', borderWidth: 1, marginTop: 18 }, reusableStyles.lessRounded]}
        placeholder={"Unit"}
        onChangeText={(text) => setMilestoneU(text)}
      >

      </TextInput>
      <TextInput style={[reusableStyles.textInput, { height: 44, borderColor: 'black', borderWidth: 1, marginTop: 18 }, reusableStyles.lessRounded]}
        placeholder={"Target Date"}
        onChangeText={(text) => setMilestoneTU(text)}
      >

      </TextInput>
      {showValidationError && (
        <Text>TITLE AND/OR DESCRIPTION MISSING</Text>
      )}
    </View>
  );
};

export default MilestoneAdd;