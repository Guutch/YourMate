import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { reusableStyles } from '../components/styles'; // Adjust the path


const SignIn = ({ navigation }) => {
  return (
    <View style={[reusableStyles.container, { alignItems: 'center' }]}>
      {/* Header Text */}
      <Text style={[reusableStyles.headerText, { marginBottom: 9 }]}>
        Log in to Your Mate
      </Text>


      {/* Email Group */}
      <View style={{ marginBottom: 9 }}>
        <Text style={[reusableStyles.labelText, { marginBottom: 10 }]}>
          Email
        </Text>
        <TextInput
          style={[reusableStyles.textInput, reusableStyles.lessRounded, { height: 44, borderColor: 'black', borderWidth: 1 }]}
        // Add other TextInput props (placeholder, keyboardType, etc.)
        />
      </View>

      {/* Password Group */}
      <View style={{ marginBottom: 9 }}>
        <Text style={[reusableStyles.labelText, { marginBottom: 10 }]}>
          Password
        </Text>
        <TextInput
          style={[reusableStyles.textInput, reusableStyles.lessRounded, { height: 44, borderColor: 'black', borderWidth: 1 }]}
          secureTextEntry
        // Add other TextInput props (placeholder, etc.)
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={[reusableStyles.button, reusableStyles.lessRounded, { backgroundColor: '#0077FF', marginTop: 15 }]}
        onPress={() => navigation.navigate('MainFlow')}
      >
        <Text style={reusableStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>

  );
};

export default SignIn;
