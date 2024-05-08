import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { reusableStyles } from '../components/styles'; // Adjust the path
import { setJustCreatedGoal, setJustCreatedM } from '../components/GoalStore'
import UserModel from '../firebase/UserModel';
import { app } from '../firebase/firebase'
import { getAuth } from 'firebase/auth';

const auth = getAuth(app);

const MilestoneAdd = ({ navigation, route }) => {
  const { fromMain, selected, goalId } = route.params;
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneTV, setMilestoneTV] = useState('');
  const [milestoneU, setMilestoneU] = useState('');
  const [showValidationError, setShowValidationError] = useState(false);

  // Allows for the goal to be created on the UI
  setJustCreatedGoal(true)

  const handleMilestoneSave = async () => {
    // If the required data is missing we show a validation error
    if (milestoneTitle.trim() === '' || milestoneDesc.trim() === '') {
      setShowValidationError(true);
    } else {
      // Performs save operation
      setShowValidationError(false);
    }

    // Try-catch blck to handle backend updates
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;

        console.log(milestoneTitle)

        // Milestone data packaged into object for the backend
        const milestoneData = {
          title: milestoneTitle, 
          description: milestoneDesc,
          milestoneTV: milestoneTV,
          milestoneU: milestoneU,
          status: 'Ongoing'
        };

        // Milestone data gets stored in the backend
        await UserModel.addMilestone(userId, goalId, milestoneData);
        setJustCreatedM(true)

        // Navigate to the next screen
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
          {milestoneTitle && milestoneDesc ? (
            <TouchableOpacity
              onPress={() => handleMilestoneSave()}
              style={{ padding: 10, borderRadius: 5 }}
            >
              <Text style={{ color: "#000", textAlign: "center", fontSize: 16 }}>
                {fromMain ? "Add" : "Next"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ),
    });


  }, [navigation, milestoneTitle, milestoneDesc, milestoneTV, milestoneU]);

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
      <View style={{ alignItems: 'center' }}>
      <Text style={[reusableStyles.headerText, { marginBottom: 15 }]}>
        Add Milestone
      </Text>

      <Text style={{color: '#000', fontWeight: 'bold'}}>Required</Text>
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

      <Text style={{color: '#000', fontWeight: 'bold', marginTop: 9}}>Optional</Text>
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
      {showValidationError && (
        <Text>TITLE AND/OR DESCRIPTION MISSING</Text>
      )}
      </View>
    </View>
  );
};

export default MilestoneAdd;