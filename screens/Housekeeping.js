import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, landing, signUpSwipe } from '../components/styles'; // Adjust the path


const HouseKeeping = ({ route, navigation }) => {
  const { fromMain, addGoal, word, selected } = route.params;

  return (
    <View style={[reusableStyles.container, {alignItems: 'center', justifyContent: 'space-around'}]}>
      {/* Header Text */}
      {/* <Text style={[reusableStyles.headerText, { marginBottom: 9 }]}>
        Before diving into the app, you're to take a quick assessment
      </Text> */}
      <View style={{ alignItems: 'center' }}>
      <Text style={signUpSwipe.text}>Before diving into the app</Text>
      <Text style={signUpSwipe.description}>you're inivited to take a quick assessment</Text>
      
      <Image source={require('../components/assets/blob.png')} style={{ transform: [{ rotate: '127deg' }] }}/>
        <TouchableOpacity
          style={[
            reusableStyles.textInput,
            reusableStyles.moreRounded,
            { backgroundColor: '#0077FF', marginTop: 15 },
          ]}
          onPress={() => navigation.navigate('Assessment', { isSignUp: true, habit: selected })}
        >
          <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
            Do the assessment
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[reusableStyles.textInput, reusableStyles.moreRounded, { backgroundColor: '#0077FF', marginTop: 9 }]}
          onPress={() => navigation.navigate('MainFlow', { fromMain, addGoal, word, selected })}
        >
          <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
            Go straight to the app
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default HouseKeeping;