import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, landing, signUp } from '../components/styles'; // Adjust the path


const MilestonneAdd = ({ navigation }) => {
    return (
        <View style={[reusableStyles.container]}>
            {/* Header Text */}
            <Text style={[reusableStyles.headerText, { marginBottom: 9 }]}>
                Add Milestone
            </Text>
        </View>
    );
};

export default MilestonneAdd;