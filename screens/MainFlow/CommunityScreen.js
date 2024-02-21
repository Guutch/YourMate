import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, homeMain, communityMain } from '../../components/styles'; // Adjust the path

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const CommunityScreen = ({ navigation }) => {

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
                    <Text>This is the</Text>
                </View>
                <View>
                    {/* Icons for habit */}
                    <Text>icon</Text>
                    {/* Joined month and year */}
                    <Text>Joined xxx</Text>
                    {/* Username */}
                    <Text>Username</Text>
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
                        <View style={[reusableStyles.button, reusableStyles.lessRounded, { backgroundColor: '#0077FF' }]}></View>
                    </View>

                </View>

            </View>
        </View>
    );
};

export default CommunityScreen;