import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { reusableStyles, goalStyles, signUp, signUpSwipe } from '../components/styles'; // Adjust the path

const ActualGoals = ({ route, navigation }) => {
    const { category, fromMain, selected } = route.params;

    const handleSelection = (goal) => {
        // if (selected === viewId) {
        //     // If the same view is selected again, reset the selection
        //     setSelected('');
        // } else {
        //     // Set the selected view
        //     setSelected(viewId);
        // }
        navigation.navigate('CreateGoal', {goal, fromMain, category, selected})
    };

    const goalsBySubcategory = {
        "Work & Career": [
          "Land new job",
          "Get professional certification",
          "Earn managerial promotion",
          "Launch startup",
          "Secure salary increase",
          "Complete major project",
          "Improve networking skills"
        ],
        Health: [
          "Reach healthy weight",
          "Run half marathon",
          "Start daily meditation",
          "Monthly health check-up",
          "Quit smoking streak",
          "30-day yoga challenge",
          "Improve sleep routine"
        ],
        Relationships: [
          "Regular date nights",
          "Reconnect with old friends",
          "Weekly family game night",
          "Volunteer locally",
          "Enhance communication skills",
          "Resolve conflict",
          "Build support network"
        ],
        Lifestyle: [
          "Declutter home seasonally",
          "Adopt minimalism",
          "Create daily self-care routine",
          "Digital detox retreat",
          "Implement eco-friendly habits",
          "Develop personal style"
        ],
        Spirituality: [
          "Read spiritual texts",
          "Attend weekly services",
          "Spiritual retreat",
          "Daily gratitude practice",
          "Explore new spirituality",
          "Volunteer spiritually"
        ],
        Recreation: [
          "Learn new instrument",
          "Take cooking class",
          "Plan hiking trip",
          "Join sports league",
          "Start travel blog",
          "Complete creative project"
        ],
        "Personal Growth": [
          "Read monthly book",
          "Learn new language",
          "Attend development seminar",
          "Practice daily journaling",
          "Overcome personal challenge",
          "Develop new habit"
        ],
        Money: [
          "Stick to budget",
          "Take finance course",
          "Start side business",
          "Save for purchase",
          "Reduce debt",
          "Start retirement plan"
        ],
        Other: [
          "Personal challenge",
          "Community project contribution",
          "Explore new interest",
          "Dedicate to cause",
          "Learn new skill"
        ]
      };
      

    const goalsToDisplay = goalsBySubcategory[category] || [];


    return (
        <View style={[reusableStyles.container]}>
            {/* Header Text */}
            <View style={{ marginBottom: 18 }}>
                <Text style={[signUpSwipe.text, { textAlign: 'center' }]}>Add Your Goal</Text>
                <Text style={[signUpSwipe.description, { marginTop: 0, textAlign: 'center' }]}>
                    {category}
                </Text>
            </View>

            {/* Other Group */}
            <View style={{ marginBottom: 9 }}>
                {/* Auto populate */}
                {goalsToDisplay.map((goal, index) => (
                    <TouchableOpacity
                        key={index} // It's better to use unique IDs if you have them
                        style={[
                            reusableStyles.textInput,
                            reusableStyles.commonView,
                        ]}
                        onPress={() => handleSelection(goal)}
                    >
                        <Text
                            style={[
                                reusableStyles.headerText,
                                { fontSize: 20 }
                            ]}
                        >
                            {goal}
                        </Text>
                    </TouchableOpacity>
                ))}
                {/* Custom */}
                {/* <TouchableOpacity
                    
                    style={[
                        reusableStyles.textInput,
                        reusableStyles.commonView,
                    ]}
                // Add onPress if you need to handle tapping on individual goals
                >
                    <Text
                        style={[
                            reusableStyles.headerText,
                            { fontSize: 20 }
                        ]}
                    >
                        Other - Need to code this
                    </Text>
                </TouchableOpacity> */}
            </View>

        </View>
    );
};

export default ActualGoals;