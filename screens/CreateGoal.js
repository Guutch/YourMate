import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { reusableStyles, goalStyles, signUp, signUpSwipe } from '../components/styles'; // Adjust the path

const ActualGoals = ({ route, navigation }) => {
    const { goal } = route.params;

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