import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, landing, signUp } from '../components/styles'; // Adjust the path


const MilestonneInfo = ({ navigation }) => {
    return (
        <View style={[reusableStyles.container]}>
            {/* Header Text */}
            <Text style={[reusableStyles.headerText, { marginBottom: 9 }]}>
                Milestones
            </Text>
            <Text style={[signUpSwipe.description, { marginTop: 0, textAlign: 'center' }]}>
                    Categories related to have been highlighted
                </Text>

            {/* Login Button */}
            <TouchableOpacity style={[reusableStyles.button, { backgroundColor: '#0077FF', marginTop: 15, borderWidth: 1, width: 335 }]}
                // onPress={validation}
                onPress={() => navigation.navigate('MilestoneAdd')}
            >
                <Text style={reusableStyles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

        </View>
    );
};

export default MilestonneInfo;