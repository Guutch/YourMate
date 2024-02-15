import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, landing, signUp } from '../../components/styles'; // Adjust the path

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Settings = ({ navigation }) => {

    const [count, setCount] = React.useState(0);

    return (
        <View style={[reusableStyles.container]}>
            <Text >SETTINGS</Text>


        </View>
    );
};

export default Settings;