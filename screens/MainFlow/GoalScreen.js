import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, goalMain, homeMain } from '../../components/styles'; // Adjust the path
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GoalItem from '../../components/GoalItem'
import MilestoneLrgGoalO from '../../components/MilestoneLrgGoalO'
import firebase from 'firebase/app';
import 'firebase/firestore';
import { app } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth';

import UserModel from '../../firebase/UserModel'

import { getGlobalData, getJustCreatedGoal, setJustCreatedGoal, setJustCreatedM } from '../../components/GoalStore';

import { Overlay } from 'react-native-elements';
import LargeGoalOverview from '../../components/LargeGoalOverlay';

import motivationMessages from '../../components/motivation'

const auth = getAuth(app);
const GoalScreen = ({ navigation, route }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayContent, setOverlayContent] = useState('options'); // 'options', 'completed', or 'delete'
    const [goals, setGoals] = useState([]); // Blocks on screen
    const [completedGoals, setCompletedGoals] = useState([]); // Blocks on screen
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [selectedGoalId, setSelectedGoalId] = useState(null);


    const userUID = auth.currentUser.uid;

    // This will work everytime the screen comes in focus
    // Need boolean to check if we need to add something from within create goal etc
    useFocusEffect(
        React.useCallback(() => {
            // Code to run every time the screen is focused
            // console.log("Here ")

            if (getJustCreatedGoal()) {
                // console.log("New goal createdd: ", getGlobalData());
                const newGoal = getGlobalData(); // This is now an object
                // console.log("newGoal");
                // console.log(newGoal);
                    
                UserModel.newGoalMile(newGoal.id, userUID)
                  .then((goalWithMilestoneData) => {
                    if (goalWithMilestoneData) {
                      setGoals((currentGoals) => [...currentGoals, goalWithMilestoneData]);
                    }
                  })
                  .catch((error) => {
                    console.error('Error fetching goal with milestone data:', error);
                  });
          
                setJustCreatedGoal(false); // Reset the flag
                setJustCreatedM(false); // Reset the flag
              } else {
                console.log("Nothing to see mate");
              }
            return () => {
                // Cleanup actions if needed
                console.log("There")
            };
        }, [])
    );

    const handleOverlayContentChange = (newContent) => {
        setOverlayContent(newContent);
    };


    const handlePress = (goalId) => {
        setSelectedGoalId(goalId); // Assuming you have a state [selectedGoalId, setSelectedGoalId]
        setOverlayContent('options');
        setShowOverlay(!showOverlay); // Toggle the overlay visibility
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
                const userUID = auth.currentUser.uid;
                const fetchedGoalData = await UserModel.fetchUserGoals(userUID);
                // console.log(fetchedGoalData);
                // console.log("goalData");

                const ongoingGoals = [];
                const completedGoals = [];

                fetchedGoalData.forEach((goal) => {
                    if (goal.status && goal.status === 'Ongoing') {
                        ongoingGoals.push(goal);
                    } else if (goal.status && goal.status === 'Completed') {
                        completedGoals.push(goal);
                    } else {
                        // Handle goals without a "status" attribute
                        // You can either add them to the "ongoingGoals" array or ignore them
                        ongoingGoals.push(goal);
                    }
                });

                console.log(ongoingGoals)
                console.log("ongoingGoals")
                console.log(completedGoals)
                console.log("completedGoals")

                setGoals(ongoingGoals);
                setCompletedGoals(completedGoals);
            } catch (error) {
                console.error('Error fetching goals:', error);
            }
        };

        fetchGoals();
    }, [userUID]);

    const handleUpdateGoalMilestones = (goalId, updatedMilestones) => {
        setGoals(currentGoals => currentGoals.map(goal => {
            if (goal.id === goalId) {
                return { ...goal, milestones: updatedMilestones };
            }
            return goal;
        }));
    };

    const updateMilestoneInGoals = (goalId, updatedMilestone) => {
        setGoals((prevGoals) => prevGoals.map((goal) => {
          if (goal.id === goalId) {
            const updatedMilestones = goal.milestones.map((milestone) => {
              if (milestone.id === updatedMilestone.id) {
                return updatedMilestone;
              }
              return milestone;
            });
            return { ...goal, milestones: updatedMilestones };
          }
          return goal;
        }));
      };
      
      const getrandomMotivationMessage = () => {
        const randomIndex = Math.floor(Math.random() * motivationMessages.length);
        console.log(motivationMessages[randomIndex])
        return motivationMessages[randomIndex];
     }

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
                            // navigation.navigate('GoalSelector', { selected: 'porn', fromMain: true });
                            setOverlayContent('motivation')
                            setShowOverlay(true)
                        }}
                        style={{
                            padding: 10,
                            borderRadius: 5,
                        }}
                    >

                        <FontAwesome5 name="dove" size={30} color="#000" />
                    </TouchableOpacity>
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
    }, [navigation, userUID]);

    const xOutOfOverlay = () => {
        setShowOverlay(false)
    }

    const updateGoalData = (updatedGoal) => {
        // Assuming each goal has a unique identifier, like `id`
        const updatedGoals = goals.map(goal =>
            goal.id === updatedGoal.id ? updatedGoal : goal
        );

        // Update the goals state with the new array
        setGoals(updatedGoals);

        // Update the selectedGoal state if needed
        setSelectedGoal(updatedGoal);
    };

    const handleDeleteGoal = async (goalId) => {
        try {
          // Delete the goal from Firestore
          await UserModel.deleteGoalAndSubcollections(userUID, goalId);
      
          // Update the goals state by filtering out the deleted goal
          setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
      
          // Update the completedGoals state by filtering out the deleted goal
          setCompletedGoals((prevCompletedGoals) =>
            prevCompletedGoals.filter((goal) => goal.id !== goalId)
          );
      
          setShowOverlay(false);
          setOverlayContent('options');
        } catch (error) {
          console.error('Error deleting goal:', error);
          // Handle the error appropriately
        }
      };

    const markGoalAsCompleted = async (goalId) => {
        console.log("COmplete this")
        console.log(goalId)
        console.log("COmplete this")
        console.log(userUID)
        try {
            // Update the goal's status in Firestore
            await UserModel.markGoalAsCompleted(userUID, goalId);

            // Update the local state
            const updatedGoals = goals.filter((goal) => goal.id !== goalId);
            const updatedCompletedGoals = [...completedGoals, ...goals.filter((goal) => goal.id === goalId)];

            setGoals(updatedGoals);
            setCompletedGoals(updatedCompletedGoals);

            setOverlayContent('options')
            setShowOverlay(!showOverlay)
        } catch (error) {
            console.error('Error marking goal as completed:', error);
        }
    };

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
                                onPress={() => markGoalAsCompleted(selectedGoalId)}
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
                    {overlayContent === 'motivation' && (
                        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}> 
                        <Text style={{ color: '#000', marginBottom: 10, fontWeight: 'bold', fontSize: 24 }}>Tips, Tricks, and Motivation</Text> 
                        <Text style={{ color: '#000', fontSize: 18 }}>{getrandomMotivationMessage()}</Text> 
                      </View>
                    )}

                    {overlayContent === 'delete' && (
                        <>
                            <Text style={{ padding: 20 }}>Are you sure you want to<Text style={{ color: 'red', fontWeight: 'bold' }}> delete </Text>your goal?</Text>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                                onPress={() => handleDeleteGoal(selectedGoalId)}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Yes</Text>
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                                onPress={() => setOverlayContent('options')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>No</Text>
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                    {overlayContent === 'lrg' && (
                        <LargeGoalOverview
                        xOut={xOutOfOverlay}
                        goal={selectedGoal}
                        onOverlayContentChange={handleOverlayContentChange}
                        userId={userUID}
                        onUpdateGoalMilestones={updateMilestoneInGoals} // This ensures the function is passed down
                      />
                      
                    )}
                    {overlayContent === 'note' && (
                        <MilestoneLrgGoalO
                            xOut={xOutOfOverlay}
                            goal={selectedGoal}
                            onOverlayContentChange={handleOverlayContentChange}
                            mode={"note"}
                            updateGoalData={updateGoalData}
                            userId={userUID}
                        />
                    )}
                    {overlayContent === 'milestone' && (
                        <MilestoneLrgGoalO
                            xOut={xOutOfOverlay}
                            goal={selectedGoal}
                            onOverlayContentChange={handleOverlayContentChange}
                            mode={"milestone"}
                            updateGoalData={updateGoalData}
                            userId={userUID}
                        />
                    )}
                </Overlay>
            )}

            <>
                {goals.length === 0 && completedGoals.length === 0 ? (
                    <Text>You don't have any goals yet.</Text>
                ) : (
                    <View style={{ flex: 1 }}>
                        {goals.length > 0 && (
                            <View style={{ flex: 0.5 }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    // marginTop: 10,
                                    color: 'black'
                                }}>Ongoing Goals</Text>
                                <FlatList
                                    data={goals}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <GoalItem
                                            goalData={item}
                                            onItemPress={handlePress}
                                            onGoalPress={goalPressed}
                                        />
                                    )}
                                    contentContainerStyle={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginVertical: 15,
                                        paddingBottom: 10
                                    }}
                                    style={{ marginRight: 5 }}
                                />
                            </View>
                        )}

                        {completedGoals.length > 0 && (
                            <View style={{ flex: 0.5 }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    // marginTop: 10,
                                    color: 'green'
                                }}>Completed Goals</Text>
                                <FlatList
                                    data={completedGoals}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <GoalItem
                                            goalData={item}
                                            onItemPress={handlePress}
                                            onGoalPress={goalPressed}
                                        />
                                    )}
                                    contentContainerStyle={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginVertical: 15,
                                        paddingBottom: 10
                                    }}
                                    style={{ marginRight: 5 }}
                                />
                            </View>
                        )}
                    </View>
                )}
            </>






        </View>
    );
};

export default GoalScreen;