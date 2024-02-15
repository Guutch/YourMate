import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, landing, signUp } from '../components/styles'; // Adjust the path
import { setJustCreatedGoal, setGlobalData } from '../components/GoalStore'


const MilestoneAdd = ({ navigation, route }) => {
    const { goal, fromMain } = route.params;

    // Allows for the goal to be created on the UI
    setGlobalData({title: goal});
    setJustCreatedGoal(true)

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(
                    fromMain ? 'MainFlow' : 'Housekeeping', 
                    { 
                      fromMain: fromMain, // Ensure the key matches what you access in MilestoneAdd
                      addGoal: true,
                      word: 'YourWordHeree',
                    }
                  )}
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
             placeholder={"Title"}>

            </TextInput>
            <TextInput style={[reusableStyles.textInput, { height: 44, borderColor: 'black', borderWidth: 1, marginTop: 18 }, reusableStyles.lessRounded]}
            placeholder={"Description"}>

            </TextInput>
        </View>
    );
};

export default MilestoneAdd;