import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, goalMain, homeMain } from '../../components/styles'; // Adjust the path
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GoalItem from '../../components/GoalItem'
import { getGlobalData, getJustCreatedGoal, setJustCreatedGoal } from '../../components/GoalStore';

import { Overlay } from 'react-native-elements';


const GoalScreen = ({ navigation, route }) => {

    // This will work everytime the screen comes in focus
    // Need boolean to check if we need to add something from within create goal etc
    useFocusEffect(
        React.useCallback(() => {
            // Code to run every time the screen is focused
            console.log("Here")

            if (getJustCreatedGoal()) {
                console.log("New goal created: ", getGlobalData());
                const newGoal = getGlobalData(); // This is now an object
                setGoals(currentGoals => [...currentGoals, newGoal]);
                setJustCreatedGoal(false); // Reset the flag
            } else {
                console.log("Nothing to see mate")
            }


            // Optionally, you can return a cleanup function that React will call
            // when the component is unmounted or before the next time the effect runs.
            // This is useful for cleaning up any side effects.
            return () => {
                // Cleanup actions if needed
                console.log("There")
            };
        }, [])
    );

    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayContent, setOverlayContent] = useState('options'); // 'options', 'completed', or 'delete'
    const [goals, setGoals] = useState([]); // Blocks on screen
    const [completedGoals, setCompletedGoals] = useState([]); // Blocks on screen


    const handlePress = () => {
        console.log("Hi")
        setShowOverlay(!showOverlay); // Toggle the boolean state
    };

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         const routes = navigation.getState().routes;

    //         if (routes.length > 1) { // Check if there are previous routes in the stack
    //             const previousRoute = routes[routes.length - 1]; // Get the previous route
    //             console.log(previousRoute.name); // Log the previous route's name
    //         }
    //     });

    //     return unsubscribe;
    // }, [navigation]);

    useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    {/* To add a new goal */}
                    <TouchableOpacity
                        onPress={() => {
                            // Navigate to the next screen
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

    return (
        <View style={[reusableStyles.container]}>

            {showOverlay && (
                <Overlay
                    isVisible={showOverlay}
                    onBackdropPress={() => {
                        setShowOverlay(false);
                        setOverlayContent('options'); // Reset the overlay content when backdrop is pressed
                    }}
                    overlayStyle={reusableStyles.overlay}
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
                                <GoalItem goalData={item} onItemPress={handlePress} />
                            )}
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