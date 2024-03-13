import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, homeMain, communityMain } from '../../components/styles'; // Adjust the path

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { app } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth';

import UserModel from '../../firebase/UserModel'

const auth = getAuth(app);
const CommunityScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [userName, setUserName] = useState("");
const [startedAt, setStartedAt] = useState("");
    const auth = getAuth();
    console.log(auth)

    useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
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
                        <FontAwesome5 name="plus" size={30} color="#000" onPress={() => setShowOverlay(true)} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            // Navigate to the next screen
                            navigation.navigate('Settings'); // Replace  'NextScreen' with the actual screen name you want to navigate to
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

    const fetchUsersData = async () => {
        try {
          const userId = auth.currentUser.uid;
          const userData = await UserModel.fetchUserData(userId);
      
            console.log("userData")
            console.log(userData)

          if (userData) {
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setUserName(userData.username);
            setStartedAt(userData.createdAt);
          } else {
            console.log('User data not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      };

    return (
        <View style={[reusableStyles.container]}>
            {/* Top piece */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, padding: 10, borderBottomColor: 'black' }}>

                <View>
                    {/* Profile icon */}
                    <View style={[homeMain.timeCircle, communityMain.updatedCircle]}>
                        <FontAwesome5 name="user" size={30} color="#000" onPress={() => setShowOverlay(true)} />
                    </View>
                    {/* Name */}
                    <Text>{firstName} {lastName}</Text>
                </View>
                <View>
                    {/* Icons for habit */}
                    <Text>icon</Text>
                    {/* Joined month and year */}
                    <Text>Need to convert this</Text>
                    {/* Username */}
                    <Text>{userName}</Text>
                </View>


            </View>
            {/* Friends piece */}
            <View style={{ marginTop: 10, padding: 10 }}>
                <Text>Friends</Text>
            </View>
            {/* Friends Quest piece */}
            <View style={{ marginTop: 10, padding: 10 }}>
                <Text>Friends Quest</Text>
                <View style={[reusableStyles.textInput, { height: 128, alignContent: 'center', justifyContent: 'center' }, reusableStyles.lessRounded]}>
                    <View style={{ justifyContent: 'space-around', alignItems: 'center' }}>
                        <Text>You have no active friend quest</Text>
                        <TouchableOpacity style={[reusableStyles.button, reusableStyles.lessRounded, { backgroundColor: '#0077FF' }]}
                        onPress={fetchUsersData}
                        ></TouchableOpacity>
                    </View>

                </View>

            </View>
        </View>
    );
};

export default CommunityScreen;