import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Keyboard, ScrollView, Platform, Touchable } from 'react-native';
import { reusableStyles, landing, homeMain } from '../../components/styles'; // Adjust the path

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import JournalItem from '../../components/JournalItem'


const JournalScreen = ({ navigation }) => {
    const [journals, setJournals] = useState([]);
    const [id, setId] = useState(0)

    const addJournal = () => {
        const newJournal = {
            id: id,
            time: new Date().toLocaleString(), // Convert Date to a string
            title: "title"
        };
        let lol = id;
        setId(id+lol);
        console.log("New journal added:", newJournal);
console.log("Updated journals:", journals);

        // Add the new block to the blocks state
        setJournals([...journals, newJournal]);
    }

    const renderItem = ({ item }) => (
        <View style={homeMain.blocksContainer}>
            <JournalItem />
        </View>
    );

    useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => {
                            // Navigate to the next screen
                            // addJournal(); // Replace 'NextScreen' with the actual screen name you want to navigate to
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
{/* <JournalItem/> */}
<TouchableOpacity style={reusableStyles.textInput} onPress={addJournal}></TouchableOpacity>
            {journals.length === 0 ? (
                <View style={homeMain.noBlocksContainer}>
                    <Text>Press '+' to add a Journal piece</Text>
                </View>
            ) : (
                <FlatList
                        data={journals}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
            )}
        </View>
    );
};

export default JournalScreen;