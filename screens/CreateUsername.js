import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { reusableStyles, signUpSwipe, username } from '../components/styles'; // Adjust the path


const CreateUsername = ({ navigation }) => {
    return (
        <View style={[reusableStyles.container,]}>
            {/* Main Text */}
            <View style={{marginBottom: 9}}>

            </View>
            <Text style={[reusableStyles.headerText]}>
                Let's create your username
            </Text>
            <Text style={[signUpSwipe.description, username.subtitle]}>Grow with others in the community</Text>



            {/* Email Group */}
            <View style={{ marginBottom: 9 }}>
                <Text style={[reusableStyles.labelText, { marginBottom: 10 }]}>
                    Username
                </Text>
                <TextInput
                    style={[reusableStyles.textInput, reusableStyles.lessRounded, { height: 44, borderColor: 'black', borderWidth: 1 }]}
                // Add other TextInput props (placeholder, keyboardType, etc.)
                />
            </View>

            {/* Continue Button */}
            <TouchableOpacity style={[reusableStyles.button, reusableStyles.lessRounded, { backgroundColor: '#0077FF', marginTop: 15 }]}
            onPress={() => navigation.navigate('HabitSelector')}>
                <Text style={reusableStyles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>

    );
};

export default CreateUsername;
