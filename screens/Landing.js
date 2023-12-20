import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { reusableStyles, landing } from '../components/styles'; // Adjust the path

const Landing = ({ navigation }) => {
    return (
        <View style={reusableStyles.container}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <View style={landing.mainContainer}>
                <Text style={landing.mainText}>
                    Welcome to Your Mate
                </Text>
            </View>
            <View style={landing.continueContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                    <Text style={landing.signInText}>Already got an account? Sign in</Text>
                </TouchableOpacity>

                <TouchableOpacity style={reusableStyles.button} onPress={() => navigation.navigate('SignUpSwipe')}>
                    <Text style={reusableStyles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Landing;