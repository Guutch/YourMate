import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, landing, signUp } from '../components/styles'; // Adjust the path
import { setJustCreatedGoal, setGlobalData } from '../components/GoalStore'

import UserModel from '../firebase/UserModel';
import { app } from '../firebase/firebase'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
const auth = getAuth(app);
const MilestoneAdd = ({ navigation, route }) => {
    const { goal, fromMain } = route.params;
    const [milestoneTitle, setMilestoneTitle] = useState('');
    const [milestoneDesc, setMilestoneDesc] = useState('');

    // Allows for the goal to be created on the UI
    // setGlobalData({title: goal});
    setJustCreatedGoal(true)

    const handleMilestoneSave = async () => {
      try {
          const user = auth.currentUser;
          if (user) {
              const userId = user.uid;

              console.log("milestoneTitle")
              console.log(milestoneTitle)
              console.log("milestoneDesc")
              console.log(milestoneDesc)

              // Assuming you have already captured these values from your form inputs
              // await UserModel.addGoal(userId, goal, category, date, targetDate, startingValue, numericalTarget, unit);
              console.log('Goal created successfully');

              // Navigate to the next screen after saving the goal
              navigation.navigate(
                  fromMain ? 'MainFlow' : 'Housekeeping', 
                  { 
                    fromMain: fromMain, // Ensure the key matches what you access in MilestoneAdd
                    addGoal: true,
                    word: 'YourWordHeree',
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
          

    }, [navigation]);

    return (
        <View style={[reusableStyles.container]}>
            {/* Header Text */}
            <Text style={[reusableStyles.headerText, { marginBottom: 9 }]}>
                Add Milestone
            </Text>
            <TextInput style={[reusableStyles.textInput, ,{ height: 44, borderColor: 'black', borderWidth: 1, marginTop: 9 }, reusableStyles.lessRounded]}
             placeholder={"Title"}
             onChangeText={setMilestoneTitle}
             >

            </TextInput>
            <TextInput style={[reusableStyles.textInput, { height: 44, borderColor: 'black', borderWidth: 1, marginTop: 18 }, reusableStyles.lessRounded]}
            placeholder={"Description"}
            onChangeText={setMilestoneDesc}
            >

            </TextInput>
        </View>
    );
};

export default MilestoneAdd;