import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { reusableStyles, signUpSwipe } from '../components/styles'; 
import getQuestions from '../components/Questions';

const Assessment = ({ route, navigation }) => {
    const { isSignUp, habit } = route.params;
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [showQuestions, setShowQuestions] = useState(false);
    const [selected, setSelected] = useState([]);

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
        const loadedQuestions = getQuestions(habit);
        setQuestions(loadedQuestions);
    }, []);

    return (
        <ScrollView style={reusableStyles.container}>
            <View>
                {/* Question and answers */}
                {questions.map((q, index) => (
                    <View key={index} style={{ alignItems: 'center' }}>
                        <Text style={[signUpSwipe.description]}>{q.question}</Text>

                        {q.options.map((option, optionIndex) => (
                            <TouchableOpacity
                                key={optionIndex}
                                onPress={() => handleSelection(`${index}_${optionIndex}`)}
                                style={[
                                    reusableStyles.textInput,
                                    reusableStyles.commonView,
                                    {
                                        marginTop: 9,
                                        borderColor: selected.includes(`${index}_${optionIndex}`) ? "#0077FF" : 'black',
                                        backgroundColor: selected.includes(`${index}_${optionIndex}`) ? "#0077FF" : 'transparent',
                                    },
                                ]}
                            >
                                <Text style={{ color: selected.includes(`${index}_${optionIndex}`) ? 'white' : '#000', fontWeight: 'bold' }}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Continue btn */}
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
                            marginTop: 15,
                            marginBottom: 30,
                            alignSelf: 'center'
                        },
                    ]}
                >
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
                        Okay
                    </Text>
                </TouchableOpacity>
            </View>



        </ScrollView>
    );
};

export default Assessment;