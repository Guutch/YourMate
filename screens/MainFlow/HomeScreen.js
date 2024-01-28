import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, landing, signUp } from '../../components/styles'; // Adjust the path

import { Overlay } from 'react-native-elements';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const HomeScreen = ({ navigation }) => {
    const [showOverlay, setShowOverlay] = useState(false);


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
                            navigation.navigate('MilestoneInfo'); // Replace  'NextScreen' with the actual screen name you want to navigate to
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
                <Overlay isVisible={showOverlay} onBackdropPress={() => setShowOverlay(false)} overlayStyle={[reusableStyles.overlay]}>
                    <Text style={{padding: 20}}>Focus Session</Text>
                    <View style={[reusableStyles.textInput, reusableStyles.lessRounded, {alignSelf: 'center'}]}>
                        <Text>Solo</Text>
                    </View>
                </Overlay>
            )}
        </View>
    );
};

export default HomeScreen;