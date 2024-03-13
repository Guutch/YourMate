import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { reusableStyles, landing } from '../components/styles'; // Adjust the path

import { app } from '../firebase/firebase'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Initialize the Firebase Authentication service for the given Firebase app
const auth = getAuth(app);

const Landing = ({ navigation }) => {

    const user = auth.currentUser;
    if (user) {
        console.log("User is signed in", user);
    } else {
        console.log("No user is signed in.");
    }
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