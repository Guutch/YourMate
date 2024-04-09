import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, landing, signUp } from '../components/styles'; // Adjust the path


const HouseKeeping = ({ route, navigation }) => {
    // Destructure the params from the route object
    const { fromMain, addGoal, word, selected } = route.params;
  
    console.log("Selected")
    console.log(selected)

    return (
      <View style={[reusableStyles.container]}>
        {/* Header Text */}
        <Text style={[reusableStyles.headerText, { marginBottom: 9 }]}>
          Before diving into the {selected} app, we invite you to take a quick assessment
        </Text>
        <TouchableOpacity
          style={[
            reusableStyles.textInput,
            reusableStyles.moreRounded,
            { backgroundColor: '#0077FF' },
          ]}
          onPress={() => navigation.navigate('Assessment', {isSignUp: true, habit: selected})}
        >
          <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
            Do the assessment
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[reusableStyles.textInput, reusableStyles.moreRounded, { backgroundColor: '#0077FF' },]}
          onPress={() => navigation.navigate('MainFlow', { fromMain, addGoal, word, selected })}
        >
          <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
            Go straight to the app
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default HouseKeeping;