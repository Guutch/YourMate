import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RadioButton } from 'react-native';
import { reusableStyles, communityMain, signUp } from '../components/styles'; // Adjust the path


const Assessment = ({ route, navigation }) => {
    const { isSignUp, habit } = route.params;
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [showQuestions, setShowQuestions] = useState(false);
    const [selected, setSelected] = useState([]);

    console.log("Habit")
    console.log(habit)

    // Fetch questions based on the habit
    const getQuestions = () => {
        switch (habit) {
            case 'porn':
                return [
                    {
                        question: 'Frequency of Use: How often do you view pornography?',
                        options: ['Daily', 'Several times a week', 'Once a week', 'Less than once a week', 'Rarely'],
                    },
                    {
                        question: 'Duration of Use: On average, how much time do you spend viewing pornography per session?',
                        options: ['Less than 10 minutes', '10 to 30 minutes', '30 minutes to 1 hour', 'More than 1 hour'],
                    },
                    {
                        question: 'Impact on Daily Life: Do you feel that your pornography use impacts your daily responsibilities or relationships?',
                        options: ['Significantly', 'Moderately', 'Slightly', 'Not at all'],
                    },
                    {
                        question: 'Efforts to Reduce or Stop: Have you ever attempted to reduce or stop your pornography consumption?',
                        options: ['Yes, successfully', 'Yes, but unsuccessfully', 'No, but I\'ve considered it', 'No, and I haven\'t considered it'],
                    },
                    {
                        question: 'Reasons for Use: What are your primary reasons for viewing pornography? (Select all that apply)',
                        options: ['Entertainment/Leisure', 'Coping mechanism for stress or emotional distress', 'Curiosity', 'Habit', 'Other (please specify): ___________'],
                    },
                    {
                        question: 'Awareness and Concern: How concerned are you about your pornography use?',
                        options: ['Very concerned', 'Somewhat concerned', 'Slightly concerned', 'Not concerned'],
                    },
                    {
                        question: 'Interest in Change: Would you be interested in resources or assistance to modify your pornography consumption habits?',
                        options: ['Yes', 'Maybe', 'No'],
                    },
                ];
            case 'procrastination':
                return [
                    {
                        question: 'Frequency of Procrastination: How often do you find yourself procrastinating on tasks that need to be completed?',
                        options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
                    },
                    {
                        question: 'Types of Tasks Delayed: What types of tasks do you most frequently procrastinate on?',
                        options: ['Work or school assignments', 'Household chores', 'Personal projects', 'Making important decisions', 'Other (Please specify)'],
                    },
                    {
                        question: 'Reasons for Procrastination: What are the main reasons you procrastinate?',
                        options: ['Lack of motivation', 'Fear of failure', 'Overwhelmed by the task', 'Distractions (social media, TV, etc.)', 'Perfectionism'],
                    },
                    {
                        question: 'Impact on Performance: How does procrastination affect your performance or the quality of work?',
                        options: ['Significantly worsens it', 'Somewhat worsens it', 'No impact', 'Somewhat improves it (work better under pressure)', 'Significantly improves it (work best under pressure)'],
                    },
                    {
                        question: 'Emotional Impact: How does procrastinating make you feel?',
                        options: ['Stressed', 'Anxious', 'Guilty', 'Indifferent', 'Relieved'],
                    },
                    {
                        question: 'Efforts to Overcome Procrastination: Have you tried to overcome your procrastination? If so, what methods have you tried?',
                        options: ['Yes (time management tools, breaking tasks into smaller steps, etc.)', 'No, but I want to', 'No, and I\'m not interested in changing'],
                    },
                ];
            case 'screen_time':
                return [
                    {
                        question: 'Daily Screen Time: How much time do you spend in front of screens daily (including smartphones, computers, tablets, and TVs)?',
                        options: ['Less than 2 hours', '2 to 4 hours', '4 to 6 hours', '6 to 8 hours', 'More than 8 hours'],
                    },
                    {
                        question: 'Purpose of Screen Time: What are your primary reasons for screen time? (Select all that apply)',
                        options: ['Work or study', 'Social media', 'Gaming', 'Watching TV shows or movies', 'Reading or research', 'Other (Please specify)'],
                    },
                    {
                        question: 'Impact on Physical Health: Have you experienced any physical discomfort or health issues that you believe are related to screen time? (e.g., eye strain, headaches, sleep disturbances)',
                        options: ['Yes', 'No'],
                    },
                    {
                        question: 'Screen Time Management: Have you taken any steps to manage or reduce your screen time?',
                        options: ['Yes, successfully', 'Yes, but not successfully', 'No, but I\'ve considered it', 'No, and I haven\'t considered it'],
                    },
                    {
                        question: 'Awareness of Screen Time: Are you aware of the recommended limits for daily screen time and the potential health implications of exceeding those limits?',
                        options: ['Fully aware', 'Somewhat aware', 'Not aware'],
                    },
                ];
            case 'online_gambling':
                return [
                    {
                        question: 'Frequency of Online Gambling: How often do you participate in online gambling activities?',
                        options: ['Daily', 'Several times a week', 'Weekly', 'Monthly', 'Rarely or never'],
                    },
                    {
                        question: 'Types of Gambling Activities: What types of online gambling activities do you engage in? (Select all that apply)',
                        options: ['Sports betting', 'Casino games (e.g., slots, roulette)', 'Poker', 'Fantasy sports', 'Others (Please specify)'],
                    },
                    {
                        question: 'Duration of Gambling Sessions: On average, how long do your online gambling sessions last?',
                        options: ['Less than 30 minutes', '30 minutes to 1 hour', '1 to 2 hours', 'More than 2 hours'],
                    },
                    {
                        question: 'Financial Expenditure: How much money do you typically spend on online gambling per month?',
                        options: ['Less than $50', '$50 to $200', '$200 to $500', 'More than $500'],
                    },
                    {
                        question: 'Reasons for Gambling: Why do you engage in online gambling? (Select all that apply)',
                        options: ['Entertainment/Leisure', 'To make money', 'Social reasons', 'To relieve stress or escape problems', 'Other (Please specify)'],
                    },
                    {
                        question: 'Impact on Personal and Financial Well-being: How has online gambling affected your personal and financial well-being?',
                        options: ['Positively', 'Negatively', 'No significant impact'],
                    },
                    {
                        question: 'Efforts to Modify Gambling Behavior: Have you ever attempted to reduce or stop gambling?',
                        options: ['Yes, successfully', 'Yes, but reverted back', 'No, but I\'ve considered it', 'No, and I haven\'t considered it'],
                    },
                ];
            default:
                return [];
        }
    };



    const handleSelection = (optionId) => {
        const [questionIndex, optionIndex] = optionId.split('_').map(Number);

        // Reset the selection for the current question
        const newSelected = selected.filter(
            (id) => !id.startsWith(`${questionIndex}_`)
        );

        // Add or remove the selected option
        if (newSelected.includes(optionId)) {
            setSelected(newSelected.filter((id) => id !== optionId));
        } else {
            setSelected([...newSelected, optionId]);
        }
    };

    // Check if all questions have been answered
    const allQuestionsAnswered = () => {
        return questions.every((q, index) =>
            selected.some((id) => id.startsWith(`${index}_`))
        );
    };

    // Load questions when the component mounts
    useEffect(() => {
        const loadedQuestions = getQuestions();
        setQuestions(loadedQuestions);
    }, []);



    return (
        <ScrollView style={reusableStyles.container}>
            <Text>{habit}</Text>
            {questions.map((q, index) => (
                <View key={index}>
                    <Text style={{ fontWeight: 'bold' }}>{q.question}</Text>
                    {q.options.map((option, optionIndex) => (
                        <TouchableOpacity
                            key={optionIndex}
                            onPress={() => handleSelection(`${index}_${optionIndex}`)}
                            style={[
                                reusableStyles.textInput,
                                reusableStyles.commonView,
                                {
                                    borderColor: selected.includes(`${index}_${optionIndex}`) ? "#0077FF" : 'black',
                                    backgroundColor: selected.includes(`${index}_${optionIndex}`) ? "#0077FF" : 'transparent',
                                },
                            ]}
                        >
                            <Text>- {option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}

<TouchableOpacity
  onPress={() => {
    if (allQuestionsAnswered()) {
      // Retrieve questions based on the habit
      const questions = getQuestions(habit);

      // Parse the selected state to create a more accessible structure
      const selectedIndices = selected.reduce((acc, curr) => {
        const [questionIndex, optionIndex] = curr.split('_').map(Number);
        acc[questionIndex] = optionIndex;
        return acc;
      }, {});

      // Map questions to their selected options using the new structure
      const selectedQuestions = questions.map((q, index) => {
        const selectedOptionIndex = selectedIndices[index];
        const selectedOption = q.options[selectedOptionIndex];
        return {
          question: q.question,
          selectedOption: selectedOption,
        };
      });

      // Navigate to the ResultsScreen with habit, selectedQuestions, and possibly the original questions for further use
      navigation.navigate('ResultsScreen', { habit, selectedQuestions, questions, isSignUp });
    }
  }}
  disabled={!allQuestionsAnswered()}
  style={[
    reusableStyles.textInput,
    reusableStyles.moreRounded,
    {
      backgroundColor: allQuestionsAnswered() ? '#0077FF' : '#ccc',
      marginBottom: 20,
    },
  ]}
>
  <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
    Okay
  </Text>
</TouchableOpacity>


        </ScrollView>
    );
};

export default Assessment;