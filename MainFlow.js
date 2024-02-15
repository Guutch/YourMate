import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


import HomeScreen from './screens/MainFlow/HomeScreen';
import GoalScreen from './screens/MainFlow/GoalScreen';
import JournalScreen from './screens/MainFlow/JournalScreen';
import CommunityScreen from './screens/MainFlow/CommunityScreen';

const Tab = createBottomTabNavigator();

function MainFlow() {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'black',
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#007FFF',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home'; // use the appropriate icon name
                    } else if (route.name === 'Goals') {
                        iconName = 'bullseye'; // use the appropriate icon name
                    } else if (route.name === 'Journal') {
                        iconName = 'book'; // use the appropriate icon name
                    } else if (route.name === 'Community') {
                        iconName = 'people-arrows'; // use the appropriate icon name
                    }
                    // You can return any component that you like here!
                    return <FontAwesome5 name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={({ navigation }) => ({
                    headerShadowVisible: false,
                    // headerRight: () => (
                    //     <View style={{ flexDirection: 'row' }}>
                    //         <TouchableOpacity
                    //             onPress={() => {
                    //                 // Navigate to the next screen
                    //                 navigation.navigate('MilestoneInfo'); // Replace 'NextScreen' with the actual screen name you want to navigate to
                    //             }}
                    //             style={{
                    //                 padding: 10,
                    //                 borderRadius: 5,
                    //             }}
                    //         >
                    //             <FontAwesome5 name="plus" size={30} color="#000" />

                    //         </TouchableOpacity>
                    //         <TouchableOpacity
                    //             onPress={() => {
                    //                 // Navigate to the next screen
                    //                 navigation.navigate('MilestoneInfo'); // Replace 'NextScreen' with the actual screen name you want to navigate to
                    //             }}
                    //             style={{
                    //                 padding: 10,
                    //                 borderRadius: 5,
                    //             }}
                    //         >
                    //             <FontAwesome5 name="cog" size={30} color="#000" />

                    //         </TouchableOpacity>
                    //     </View>
                    // ),
                    headerTitleAlign: 'center', // Center-align the title
                })}
            />

            <Tab.Screen name="Goals" component={GoalScreen} options={({ route, navigation }) => ({
                headerShadowVisible: false,
                headerTitleAlign: 'center', // Center-align the title
            })} />
            <Tab.Screen name="Community" component={CommunityScreen} options={({ navigation }) => ({
                headerShadowVisible: false,
                headerRight: () => (
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    // Navigate to the next screen
                                    navigation.navigate('MilestoneInfo'); // Replace 'NextScreen' with the actual screen name you want to navigate to
                                }}
                                style={{
                                    padding: 10,
                                    borderRadius: 5,
                                }}
                            >
                                <FontAwesome5 name="plus" size={30} color="#000" />

                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    // Navigate to the next screen
                                    navigation.navigate('MilestoneInfo'); // Replace 'NextScreen' with the actual screen name you want to navigate to
                                }}
                                style={{
                                    padding: 10,
                                    borderRadius: 5,
                                }}
                            >
                                <FontAwesome5 name="cog" size={30} color="#000" />

                            </TouchableOpacity>
                        </View>
                    ),
                headerTitleAlign: 'center', // Center-align the title
            })} />
            <Tab.Screen name="Journal" component={JournalScreen} options={({ navigation }) => ({
                headerShadowVisible: false,
                headerRight: () => (
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    // Navigate to the next screen
                                    navigation.navigate('MilestoneInfo'); // Replace 'NextScreen' with the actual screen name you want to navigate to
                                }}
                                style={{
                                    padding: 10,
                                    borderRadius: 5,
                                }}
                            >
                                <FontAwesome5 name="plus" size={30} color="#000" />

                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    // Navigate to the next screen
                                    navigation.navigate('MilestoneInfo'); // Replace 'NextScreen' with the actual screen name you want to navigate to
                                }}
                                style={{
                                    padding: 10,
                                    borderRadius: 5,
                                }}
                            >
                                <FontAwesome5 name="cog" size={30} color="#000" />

                            </TouchableOpacity>
                        </View>
                    ),
                headerTitleAlign: 'center', // Center-align the title
            })} />

            {/* other tabs */}
        </Tab.Navigator>
    );
}

export default MainFlow;
