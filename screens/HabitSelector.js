import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Overlay } from 'react-native-elements';


import UserModel from '../firebase/UserModel';
import { app } from '../firebase/firebase'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Initialize the Firebase Authentication service for the given Firebase app
const auth = getAuth(app);

import { reusableStyles, landing, signUp, signUpSwipe } from '../components/styles'; // Adjust the path

const HabitSelector = ({ navigation }) => {

    const [selected, setSelected] = useState('');
    const [visible, setVisible] = useState(false);

    const [inputValue, setInputValue] = useState('');

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const user = auth.currentUser;

if (user) {
    console.log("User is signed in", user);
} else {
    console.log("No user is signed in.");
}

const handleHabitSave = async () => {
    try {
        console.log(selected)
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          
          const habitName = selected === 'other' ? inputValue : selected;
    
          await UserModel.addHabit(userId, habitName);
          console.log('Habit created successfully');
    
          // After saving the habit, you can navigate to the next screen
          if (selected) {
            navigation.navigate('GoalSelector', { selected, fromMain: false });
          } else if (inputValue) {
            navigation.navigate('GoalSelector', { inputValue, fromMain: false });
          }
        } else {
          console.error('User not authenticated');
        }
      } catch (error) {
        console.error('Error creating habit:', error);
        // Handle error
      }
  };

    const handleSelection = (viewId) => {
        if (selected === viewId) {
            // If the same view is selected again, reset the selection
            setSelected('');
        } else {
            // Set the selected view
            setSelected(viewId);
        }
    };

    const handleNav = (inputValue) => {
        if (selected === 'other') {
            // If 'other' is selected, navigate to the next screen with the inputValue
            // navigation.navigate('GoalSelector', { inputValue });
            console.log(user.uid)
            console.log("user.uid")
            toggleOverlay(); // Close the overlay
        } else if (selected) {
            // If a different option is selected, navigate to 'GoalSelector' with the selected value
            handleHabitSave();
        }
    };
    return (
        <View style={[reusableStyles.container, {alignItems: 'center'}]}>
            {/* Header Text */}
            <Text style={signUpSwipe.text}>What's Your Habit</Text>
            <Text style={signUpSwipe.description}>Your Mate is here for YOU</Text>

            {/* Overlay */}
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={reusableStyles.overlay}>
                <Text>Enter in your habit!</Text>
                <TextInput
                    style={[reusableStyles.textInput, reusableStyles.lessRounded]}
                    onChangeText={(text) => setInputValue(text)}
                    value={inputValue}
                />
                <TouchableOpacity
                    style={[
                        reusableStyles.button,
                        {
                            backgroundColor: inputValue ? '#0077FF' : '#B0C4DE', // Change color based on inputValue
                            marginTop: 15,
                            borderWidth: 1,
                            width: 335
                        }
                    ]}
                    onPress={() => handleHabitSave()} // Pass inputValue to handleNav
                    disabled={!inputValue} // Disable button if inputValue is empty
                >
                    <Text style={reusableStyles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </Overlay>

            {/* Porn Group */}
            <View style={{ marginBottom: 9, marginTop: 15 }}>
                <TouchableOpacity
                    style={[
                        reusableStyles.textInput,
                        reusableStyles.commonView,
                        {
                            borderColor: selected === 'porn' ? "#0077FF" : 'black',
                            backgroundColor: selected === 'porn' ? "#0077FF" : 'transparent', // Change background color if selected
                        }
                    ]}
                    onPress={() => handleSelection('porn')}
                >
                    <Text
                        style={[
                            reusableStyles.headerText,
                            {
                                fontSize: 20,
                                color: selected === 'porn' ? 'white' : 'black', // Change text color if selected
                            }
                        ]}
                    >
                        Pornography
                    </Text>
                </TouchableOpacity>

                {/* Repeat for other views */}
            </View>

            {/* Procrastination Group */}
            <View style={{ marginBottom: 9 }}>
                <TouchableOpacity
                    style={[
                        reusableStyles.textInput,
                        reusableStyles.commonView,
                        {
                            borderColor: selected === 'procrastination' ? "#0077FF" : 'black',
                            backgroundColor: selected === 'procrastination' ? "#0077FF" : 'transparent', // Change background color if selected
                        }
                    ]}
                    onPress={() => handleSelection('procrastination')}
                >
                    <Text
                        style={[
                            reusableStyles.headerText,
                            {
                                fontSize: 20,
                                color: selected === 'procrastination' ? 'white' : 'black', // Change text color if selected
                            }
                        ]}
                    >
                        Procrastination
                    </Text>
                </TouchableOpacity>

                {/* Repeat for other views */}
            </View>

            {/* General Group */}
            <View style={{ marginBottom: 9 }}>
                <TouchableOpacity
                    style={[
                        reusableStyles.textInput,
                        reusableStyles.commonView,
                        {
                            borderColor: selected === 'general' ? "#0077FF" : 'black',
                            backgroundColor: selected === 'general' ? "#0077FF" : 'transparent', // Change background color if selected
                        }
                    ]}
                    onPress={() => handleSelection('general')}
                >
                    <Text
                        style={[
                            reusableStyles.headerText,
                            {
                                fontSize: 20,
                                color: selected === 'general' ? 'white' : 'black', // Change text color if selected
                            }
                        ]}
                    >
                        General Screen-Time
                    </Text>
                </TouchableOpacity>

                {/* Repeat for other views */}
            </View>

            {/* Gambling Group */}
            <View style={{ marginBottom: 9 }}>
                <TouchableOpacity
                    style={[
                        reusableStyles.textInput,
                        reusableStyles.commonView,
                        {
                            borderColor: selected === 'gambling' ? "#0077FF" : 'black',
                            backgroundColor: selected === 'gambling' ? "#0077FF" : 'transparent', // Change background color if selected
                        }
                    ]}
                    onPress={() => handleSelection('gambling')}
                >
                    <Text
                        style={[
                            reusableStyles.headerText,
                            {
                                fontSize: 20,
                                color: selected === 'gambling' ? 'white' : 'black', // Change text color if selected
                            }
                        ]}
                    >
                        Online Gambling
                    </Text>
                </TouchableOpacity>

                {/* Repeat for other views */}
            </View>

            {/* Other Group */}
            {/* <View style={{ marginBottom: 9 }}>
                <TouchableOpacity
                    style={[
                        reusableStyles.textInput,
                        reusableStyles.commonView,
                        {
                            borderColor: selected === 'other' ? "#0077FF" : 'black',
                            backgroundColor: selected === 'other' ? "#0077FF" : 'transparent', // Change background color if selected
                        }
                    ]}
                    onPress={() => handleSelection('other')}
                >
                    <Text
                        style={[
                            reusableStyles.headerText,
                            {
                                fontSize: 20,
                                color: selected === 'other' ? 'white' : 'black', // Change text color if selected
                            }
                        ]}
                    >
                        Other
                    </Text>
                </TouchableOpacity>

            </View> */}

            {/* Continue Button */}
            <TouchableOpacity
                style={[
                    reusableStyles.button,
                    {
                        backgroundColor: selected ? '#0077FF' : '#B0C4DE',
                        borderWidth: 1,
                        width: 335
                    }
                ]}
                onPress={() => handleNav()} // No arguments passed
                disabled={!selected}
            >
                <Text style={reusableStyles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HabitSelector;