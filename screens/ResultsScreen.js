import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RadioButton } from 'react-native';
import { reusableStyles, communityMain, signUp } from '../components/styles'; // Adjust the path
import getQuestions from '../components/Questions';

const ResultsScreen = ({ route, navigation }) => {
  const { habit, selectedQuestions, questions, isSignUp } = route.params;

  const generateFeedback = () => {
    const feedbackArray = [];
  
    selectedQuestions.forEach(({ question, selectedOption }) => {
      // Find the corresponding feedback in the questions list
      const matching_feedback = questions.find(q => q.question === question);
  
      // Create an object with the question text and feedback text
      const feedbackObj = {
        questionText: `For the question "${question}", you chose: ${selectedOption}.\n`,
        feedbackText: matching_feedback
          ? `${matching_feedback.feedback}\n\n`
          : "Feedback not found for this question.\n\n"
      };
  
      feedbackArray.push(feedbackObj);
    });
  
    return feedbackArray;
  };

  const feedbackArray = generateFeedback();

  return (
    <ScrollView style={reusableStyles.container}>
      <View>
      {feedbackArray.map((feedback, index) => (
      <View key={index}>
        <Text style={{ color: '#000', fontWeight: 'bold' }}>
          {feedback.questionText}
        </Text>
        <Text style={{ color: '#000' }}>{feedback.feedbackText}</Text>
      </View>
    ))}
      </View>
      <TouchableOpacity onPress={() =>
        navigation.navigate('MainFlow')
      }
        style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 15, alignSelf: 'center' }]}

      >


        <Text style={{ textAlign: 'center' }}>Go to the home screen</Text>

      </TouchableOpacity>
    </ScrollView>
  );
};

export default ResultsScreen;

