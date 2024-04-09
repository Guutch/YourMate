import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { reusableStyles } from '../components/styles'; // Adjust the path

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";



const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const auth = getAuth();

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Sign-in successful.
        console.log("Signed in successfully:", userCredential.user);
        // Navigate to the MainFlow
        navigation.navigate('MainFlow');
      })
      .catch((error) => {
        // Handle errors here.
        // console.error("Error signing in:", error.code, error.message);
        // Set error message
        setError("Incorrect details.");
      });
  };

  const handleChange = (setter) => (value) => {
    setError(''); // Clear any existing error
    setter(value); // Update the state with the new value
  };

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
          style={[reusableStyles.textInput, reusableStyles.lessRounded, { height: 44, borderColor: error ? 'red' : 'black', borderWidth: 2 }]}
          onChangeText={handleChange(setEmail)}
          value={email}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>

      {/* Password Group */}
      <View style={{ marginBottom: 9 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[reusableStyles.labelText, { marginBottom: 10 }]}>
            Password
          </Text>
          {error && (
            <Text style={[reusableStyles.labelText, { marginBottom: 10, color: 'red', fontSize: 15 }]}>
              {error}
            </Text>
          )}
        </View>

        <TextInput
          style={[reusableStyles.textInput, reusableStyles.lessRounded, { height: 44, borderColor: error ? 'red' : 'black', borderWidth: 2 }]}
          onChangeText={handleChange(setPassword)}
          value={password}
          placeholder="Enter your password"
          secureTextEntry={true} // hides the password
        />
      </View>

      {/* Login Button */}
      {/* <TouchableOpacity style={[reusableStyles.button, reusableStyles.lessRounded, { backgroundColor: '#0077FF', marginTop: 15 }]}
        onPress={() => navigation.navigate('MainFlow')}
      >
        <Text style={reusableStyles.buttonText}> Login no creds</Text>
      </TouchableOpacity> */}
      {/* Login Button */}
      <TouchableOpacity style={[reusableStyles.button, reusableStyles.lessRounded, { backgroundColor: '#0077FF', marginTop: 15 }]}
        onPress={handleSignIn}
      >
        <Text style={reusableStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>

  );
};

export default SignIn;
