import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { reusableStyles, goalStyles, signUp, signUpSwipe } from '../components/styles'; // Adjust the path
import { Overlay } from 'react-native-elements';

const GoalSelector = ({ route, navigation }) => {
    const { selected, showOverlay, setShowOverlay } = route.params;
  
    const [color, setColor] = useState('blue');

    // Porn - Health, rel;ationships, personhal growth
    // Procrastination - work, growth, money, recreatopom
    // Gambling - money, growth, recreation, health
    // General - lifestyle, health, recreation, relationships

    const categoryStyles = {
        porn: {
            relatedCategories: ['Health', 'Relationships', 'Personal Growth'],
        },
        procrastination: {
            relatedCategories: ['Work', 'Growth', 'Money', 'Recreation'],
        },
        gambling: {
            relatedCategories: ['Money', 'Growth', 'Recreation', 'Health'],
        },
        general: {
            relatedCategories: ['Lifestyle', 'Health', 'Recreation', 'Relationships'],
        },
    };

    const handleSelection = (category) => {
        // if (selected === viewId) {
        //     // If the same view is selected again, reset the selection
        //     setSelected('');
        // } else {
        //     // Set the selected view
        //     setSelected(viewId);
        // }
        navigation.navigate('ActualGoals', {category})
    };

    const handleSkipPress = () => {
        setOverlayVisible(true);
      };
    
      // Function to navigate to the next screen
      const navigateToNextScreen = () => {
        // Your navigation logic
        setShowOverlay(false); // Hide overlay after navigation
      };

    return (
        <View style={[reusableStyles.container]}>

{/* {showOverlay && (
        <Overlay isVisible={showOverlay} onBackdropPress={() => setShowOverlay(false)}>
          <Text>Are you sure you want to skip?</Text>
          <TouchableOpacity onPress={navigateToNextScreen}>
            <Text>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowOverlay(false)}>
            <Text>No</Text>
          </TouchableOpacity>
        </Overlay>
      )} */}

            {/* Header Text */}
            <View>
                <Text style={[signUpSwipe.text, { textAlign: 'center' }]}>Goal Setting</Text>
                <Text style={[signUpSwipe.description, { marginTop: 0, textAlign: 'center' }]}>
                    Categories related to
                    <Text style={{ color: "#0077FF", fontWeight: 'bold' }}> {selected} </Text>
                    have been highlighted
                </Text>
            </View>


            {/* Categories */}
            <View style={goalStyles.container}>
                <TouchableOpacity style={[
                    goalStyles.category,
                    reusableStyles.lessRounded,
                    selected && categoryStyles[selected]?.relatedCategories.includes('Work & Career')
                        ? goalStyles.highlighted
                        : {}, // This is your default border color

                ]}
                onPress={() => handleSelection('Work & Career')}
                >
                    <Text style={[reusableStyles.buttonText, { color: "#000" }]}>Work & Career</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    goalStyles.category,
                    reusableStyles.lessRounded,

                    selected && categoryStyles[selected]?.relatedCategories.includes('Health')
                        ? goalStyles.highlighted
                        : {}, // This is your default border color

                ]}
                onPress={() => handleSelection('Health')}
                >
                    <Text style={[reusableStyles.buttonText, { color: "#000" }]}>Health</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    goalStyles.category,
                    reusableStyles.lessRounded,

                    selected && categoryStyles[selected]?.relatedCategories.includes('Relationships')
                        ? goalStyles.highlighted
                        : {}, // This is your default border color

                ]}
                onPress={() => handleSelection('Relationships')}
                >
                    <Text style={[reusableStyles.buttonText, { color: "#000" }]}>Relationships</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    goalStyles.category,
                    reusableStyles.lessRounded,

                    selected && categoryStyles[selected]?.relatedCategories.includes('Lifestyle')
                        ? goalStyles.highlighted
                        : {}, // This is your default border color

                ]}
                onPress={() => handleSelection('Lifestyle')}
                >
                    <Text style={[reusableStyles.buttonText, { color: "#000" }]}>Lifestyle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    goalStyles.category,
                    reusableStyles.lessRounded,

                    selected && categoryStyles[selected]?.relatedCategories.includes('Spirituality')
                        ? goalStyles.highlighted
                        : {}, // This is your default border color

                ]}
                onPress={() => handleSelection('Spirituality')}
                >
                    <Text style={[reusableStyles.buttonText, { color: "#000" }]}>Spirituality</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    goalStyles.category,
                    reusableStyles.lessRounded,

                    selected && categoryStyles[selected]?.relatedCategories.includes('Recreation')
                        ? goalStyles.highlighted
                        : {}, // This is your default border color

                ]}
                onPress={() => handleSelection('Recreation')}
                >
                    <Text style={[reusableStyles.buttonText, { color: "#000" }]}>Recreation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    goalStyles.category,
                    reusableStyles.lessRounded,

                    selected && categoryStyles[selected]?.relatedCategories.includes('Personal Growth')
                        ? goalStyles.highlighted
                        : {}, // This is your default border color

                ]}
                onPress={() => handleSelection('Personal Growth')}
                >
                    <Text style={[reusableStyles.buttonText, { color: "#000" }]}>Personal Growth</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    goalStyles.category,
                    reusableStyles.lessRounded,

                    selected && categoryStyles[selected]?.relatedCategories.includes('Money')
                        ? goalStyles.highlighted
                        : {}, // This is your default border color

                ]}
                onPress={() => handleSelection('Money')}
                >
                    <Text style={[reusableStyles.buttonText, { color: "#000" }]}>Money</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[
                    goalStyles.category,
                    reusableStyles.lessRounded,

                    selected && categoryStyles[selected]?.relatedCategories.includes('Other')
                        ? goalStyles.highlighted
                        : {}, // This is your default border color

                ]}
                onPress={() => handleSelection('Other')}
                >
                    <Text style={[reusableStyles.buttonText, { color: "#000" }]}>Other</Text>
                </TouchableOpacity>

            </View>



            {/* Continue Button */}
            {/* <TouchableOpacity style={[reusableStyles.button, { backgroundColor: '#0077FF', marginTop: 15, borderWidth: 1, width: 335 }]}
                onPress={() => navigation.navigate('Createusername')}>
                <Text style={reusableStyles.buttonText}>Continue</Text>
            </TouchableOpacity> */}
        </View>
    );
};

export default GoalSelector;