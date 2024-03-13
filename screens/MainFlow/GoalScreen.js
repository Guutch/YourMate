import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, goalMain, homeMain } from '../../components/styles'; // Adjust the path
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GoalItem from '../../components/GoalItem'
import firebase from 'firebase/app';
import 'firebase/firestore';
import { app } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth';

import UserModel from '../../firebase/UserModel'

import { getGlobalData, getJustCreatedGoal, setJustCreatedGoal } from '../../components/GoalStore';

import { Overlay } from 'react-native-elements';
import LargeGoalOverview from '../../components/LargeGoalOverlay';

const auth = getAuth(app);
const GoalScreen = ({ navigation, route }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayContent, setOverlayContent] = useState('options'); // 'options', 'completed', or 'delete'
    const [goals, setGoals] = useState([]); // Blocks on screen
    const [completedGoals, setCompletedGoals] = useState([]); // Blocks on screen
    const [selectedGoal, setSelectedGoal] = useState(null);


    // This will work everytime the screen comes in focus
    // Need boolean to check if we need to add something from within create goal etc
    useFocusEffect(
        React.useCallback(() => {
            // Code to run every time the screen is focused
            console.log("Here ")

            if (getJustCreatedGoal()) {
                console.log("New goal created: ", getGlobalData());
                const newGoal = getGlobalData(); // This is now an object
                console.log("newGoal")
                console.log(newGoal)
                setGoals(currentGoals => [...currentGoals, newGoal]);
                setJustCreatedGoal(false); // Reset the flag
            } else {
                console.log("Nothing to see mate")
            }


            // Optionally, you can return a cleanup function that React will call
            // when the component is unmounted or before the next time the effect runs...
            // This is useful for cleaning up any side effects.
            return () => {
                // Cleanup actions if needed
                console.log("There")
            };
        }, [])
    );

    


    const handlePress = () => {
        console.log("Hi")
        setOverlayContent('options')
        setShowOverlay(!showOverlay); // Toggle the boolean state
    };

    const goalPressed = (selectedGoal) => {
        console.log("Show Lrg overlay with goal:", selectedGoal);
        setOverlayContent('lrg');
        setSelectedGoal(selectedGoal); // Store selected goal in state
        setShowOverlay(!showOverlay); // Toggle visibility of overlay
    };


    useEffect(() => {
        const fetchGoals = async () => {
          try {
            // Get the current user's ID
            const userUID = auth.currentUser.uid;
            console.log(userUID);
            console.log('user');
    
            // Fetch the goals using the UserModel
            const goalData = await UserModel.fetchUserGoals(userUID);
            console.log(goalData)
            console.log("goalData")
    
            setGoals(goalData);
            // setLoading(false);
          } catch (error) {
            console.error('Error fetchi ng goals:', error);
            // setLoading(false);
          }
        };
    
        fetchGoals();
      }, []);

    useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    {/* To add a new goal */}
                    <TouchableOpacity
                        onPress={() => {
                            // Hard coded porn as the selected habit
                            navigation.navigate('GoalSelector', { selected: 'porn', fromMain: true });
                        }}
                        style={{
                            padding: 10,
                            borderRadius: 5,
                        }}
                    >

                        <FontAwesome5 name="plus" size={30} color="#000" />
                    </TouchableOpacity>

                    {/* Settings btn */}
                    <TouchableOpacity
                        onPress={() => {
                            // Navigate to the next screen
                            navigation.navigate('Settings'); // Replace 'NextScreen' with the actual screen name you want to navigate to
                        }}
                        style={{
                            padding: 10,
                            borderRadius: 5,
                        }}
                    >
                        <FontAwesome5 name="cog" size={30} color="#000" />

                    </TouchableOpacity>
                </View>),
        });
    }, [navigation]);

    const xOutOfOverlay = () => {
        setShowOverlay(false)
        // clearSets()
    }

    return (
        <View style={[reusableStyles.container]}>

            {showOverlay && (
                <Overlay
                    isVisible={showOverlay}
                    onBackdropPress={() => {
                        setShowOverlay(false);
                        setOverlayContent('options'); // Reset the overlay content when backdrop is pressed
                    }}
                    overlayStyle={[reusableStyles.overlay, { height: overlayContent === 'lrg' ? "100%" : "auto" }]}
                >
                    {overlayContent === 'options' && (
                        <>
                            <Text style={{ padding: 20 }}>What would you like to do?</Text>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                                onPress={() => setOverlayContent('completed')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Mark as Completed</Text>
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginTop: 15 }]}
                                onPress={() => setOverlayContent('delete')}
                            >
                                {/* <Text>Delete Goal</Text> */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Delete Goal</Text>
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginTop: 15 }]}
                            // onPress={() => setOverlayContent('delete')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Modify Goal</Text>
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                </View>
                            </TouchableOpacity>
                            {/* ... other options ... */}
                        </>
                    )}

                    {overlayContent === 'completed' && (
                        <>
                            <Text style={{ padding: 20 }}>Are you sure you want to<Text style={{ color: 'green', fontWeight: 'bold' }}> complete </Text>your goal?</Text>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                            // onPress={() => setOverlayContent('delete')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Yes</Text>
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                            // onPress={() => setOverlayContent('delete')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>No</Text>
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                </View>
                            </TouchableOpacity>
                        </>
                    )}

                    {overlayContent === 'delete' && (
                        <>
                            <Text style={{ padding: 20 }}>Are you sure you want to<Text style={{ color: 'red', fontWeight: 'bold' }}> delete </Text>your goal?</Text>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                            // onPress={() => setOverlayContent('delete')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Yes</Text>
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                            // onPress={() => setOverlayContent('delete')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>NO</Text>
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                    {overlayContent === 'lrg' && (
                        <LargeGoalOverview xOut={xOutOfOverlay} goal={selectedGoal} />
                    )}
                </Overlay>
            )}

            {goals.length === 0 ? (
                <View style={homeMain.noBlocksContainer}>
                    <Text>Press '+' to add a new goal</Text>
                </View>

            ) : (
                completedGoals.length === 0 ? (
                    <View>
                        <Text >Ongoing Goals</Text>
                        <FlatList
                            data={goals}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <GoalItem goalData={item} onItemPress={handlePress} onGoalPress={goalPressed} />)}
                        />
                    </View>

                ) : (
                    <Text >Completed Goals</Text>
                )
            )}






        </View>
    );
};

export default GoalScreen;