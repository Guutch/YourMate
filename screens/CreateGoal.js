import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { reusableStyles, goalStyles, signUp, signUpSwipe } from '../components/styles'; // Adjust the path

import { setGlobalData } from '../components/GoalStore'

const ActualGoals = ({ route, navigation }) => {
    const { goal, fromMain } = route.params;

    setGlobalData(goal);
    

    console.log(fromMain)
    // If fromMain then don't go to MIlestoneInfo. Else, we go to MilestoneInfo
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(
                    fromMain ? 'MilestoneAdd' : 'MilestoneInfo', 
                    { 
                        goal: goal,
                      fromMain: fromMain // Ensure the key matches what you access in MilestoneAdd
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
            {/* Title Text */}
            <View style={{ marginBottom: 9 }}>
                <Text style={[signUpSwipe.description, { marginTop: 0, textAlign: 'center' }]}>
                    {goal}
                </Text>
            </View>

            <Text style={[signUpSwipe.description, { marginBottom: 9, textAlign: 'center' }]}>
                Core
            </Text>

            {/* Start Date */}
            <TouchableOpacity style={[reusableStyles.textInput, reusableStyles.commonView,]}
            // Add onPress if you need to handle tapping on individual goals
            >
                <Text style={[reusableStyles.headerText, { fontSize: 20 }]} >
                    Start Date
                </Text>
            </TouchableOpacity>

            {/* Target Date */}
            <TouchableOpacity style={[reusableStyles.textInput, reusableStyles.commonView,]}
            // Add onPress if you need to handle tapping on individual goals
            >
                <Text style={[reusableStyles.headerText, { fontSize: 20 }]} >
                    Target Date
                </Text>
            </TouchableOpacity>

            {/* Category */}
            <TouchableOpacity style={[reusableStyles.textInput, reusableStyles.commonView,]}
            // Add onPress if you need to handle tapping on individual goals
            >
                <Text style={[reusableStyles.headerText, { fontSize: 20 }]} >
                    Category
                </Text>
            </TouchableOpacity>

            <Text style={[signUpSwipe.description, { marginBottom: 9, textAlign: 'center' }]}>
                Deeper
            </Text>
            {/* Starting Value */}
            <TouchableOpacity style={[reusableStyles.textInput, reusableStyles.commonView,]}
            // Add onPress if you need to handle tapping on individual goals
            >
                <Text style={[reusableStyles.headerText, { fontSize: 20 }]} >
                    Starting Value
                </Text>
            </TouchableOpacity>

            {/* Numerical Target */}
            <TouchableOpacity style={[reusableStyles.textInput, reusableStyles.commonView,]}
            // Add onPress if you need to handle tapping on individual goals
            >
                <Text style={[reusableStyles.headerText, { fontSize: 20 }]} >
                    Numerical Target
                </Text>
            </TouchableOpacity>

            {/* Unit */}
            <TouchableOpacity style={[reusableStyles.textInput, reusableStyles.commonView,]}
            // Add onPress if you need to handle tapping on individual goals
            >
                <Text style={[reusableStyles.headerText, { fontSize: 20 }]} >
                    Unit
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default ActualGoals;