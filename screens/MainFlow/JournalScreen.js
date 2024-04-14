import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Keyboard, ScrollView, Platform, Touchable } from 'react-native';
import { reusableStyles, signUp, homeMain, journalStyles } from '../../components/styles'; // Adjust the path

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import JournalItem from '../../components/JournalItem'
import { Overlay } from 'react-native-elements';

import { app } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth';

import UserModel from '../../firebase/UserModel'

const auth = getAuth(app);
const JournalScreen = ({ navigation }) => {
    const [journals, setJournals] = useState([]);
    const [id, setId] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);
    const [journalTitle, setJournalTitle] = useState("");
    const [journalDesc, setJournalDesc] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [selections, setSelections] = useState({
        trigger: null,
        engage: null,
        progress: null,
    });
    const [triggerComment, setTriggerComment] = useState('');
    const [progressComment, setProgressComment] = useState('');

    const userId = auth.currentUser.uid;

    const handleSelection = (option, value) => {
        setSelections(prevSelections => ({
            ...prevSelections,
            [option]: prevSelections[option] === value ? null : value,
        }));
    };

    const xOutOfOverlay = () => {
        setShowOverlay(false)
        clearSets()
    }

    const clearSets = () => {
        setJournalTitle(''); // Reset journal title for next entry
        setJournalDesc(''); // Reset journal title for next entry
    }

    const removeJournal = async (itemToRemove) => {
        try {

            await UserModel.addJournal(userId, itemToRemove)

            setJournals((prevJournals) =>
                prevJournals.filter((journal) => journal.id !== itemToRemove.id)
            );
        } catch (error) {
            console.error("Error removing journal:", error);
        }
    };

    const addJournal = async () => {
        if (!journalTitle || !journalDesc) {
            // Set error state if title or description is empty
            setTitleError(!journalTitle);
            setDescError(!journalDesc);
            return; // Stop execution if validation fails
        }

        const newJournal = {
            time: new Date().toLocaleString(),
            title: journalTitle,
            desc: journalDesc,
            triggeredToday: selections.trigger,
            triggerComment: selections.trigger ? triggerComment : '',
            engagedInHabit: selections.engage,
            madeProgress: selections.progress,
            progressComment: selections.progress ? progressComment : '',
        };

        try {
            const userId = auth.currentUser.uid;
            // Await the ID from the addJournal method
            const journalId = await UserModel.addJournal(userId, newJournal);

            // Include this ID in the journal object added to the local state
            const newJournalWithId = { ...newJournal, id: journalId };
            setJournals((prevJournals) => [newJournalWithId, ...prevJournals]);

            // Reset input fields and selections
            setJournalTitle('');
            setJournalDesc('');
            setTitleError(false);
            setDescError(false);
            setTriggerComment('');
            setProgressComment('');
            setSelections({
                trigger: null,
                engage: null,
                progress: null,
            });

            setShowOverlay(false);
            clearSets();
        } catch (error) {
            console.error('Error adding journal:', error);
            // Handle error as needed
        }
    };


    useEffect(() => {
        const fetchJournals = async () => {
            try {
                const userId = auth.currentUser.uid;
                const fetchedJournals = await UserModel.fetchUserJournals(userId);

                // Sort the fetched journals by date in descending order
                const sortedJournals = fetchedJournals.sort((a, b) => {
                    const dateFormat = "M/D/YYYY, h:mm:ss a"; // Adjust if your format is different
                    const dateA = new Date(Date.parse(a.time, dateFormat));
                    const dateB = new Date(Date.parse(b.time, dateFormat));

                    // const dateA = new Date(a.time);fff
                    // const dateB = new Date(b.time);

                    // If the dates cannot be parsed reliably, fall back to string comparison
                    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                        return b.time.localeCompare(a.time); // String comparison
                    } else {
                        return dateB.getTime() - dateA.getTime(); // Numerical comparison 
                    }
                });

                console.log("sorted");
                console.log(sortedJournals);

                for (const log of sortedJournals) {
                    console.log(log.time)
                }

                // console.log("fetchedJournals");
                // console.log(sortedJournals);
                setJournals(sortedJournals);
            } catch (error) {
                console.error('Error fetching journals:', error);
            }
        };

        fetchJournals();
    }, []);

    const renderItem = ({ item }) => (
        <View style={homeMain.blocksContainer}>
            <JournalItem
                title={item.title}
                date={item.time}
                desc={item.desc}
                item={item}
                removeJournal={removeJournal}
            />
        </View>
    );

    const onTitleChange = (text) => {
        setJournalTitle(text);
        if (text) setTitleError(false); // Reset title error state if text is not empty
    };

    const onDescChange = (text) => {
        setJournalDesc(text);
        if (text) setDescError(false); // Reset description error state if text is not empty
    };

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
                        <FontAwesome5 name="plus" size={30} color="#000" onPress={() => setShowOverlay(true)} />
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

            {showOverlay && (
                <Overlay
                    isVisible={showOverlay}
                    onBackdropPress={() => {
                        setShowOverlay(false);
                        setOverlayContent('options'); // Reset the overlay content when backdrop is pressed
                    }}
                    overlayStyle={[reusableStyles.overlay, { height: "100%" }]}
                >
                    {/* Top Banner */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <TouchableOpacity style={{}} onPress={() => addJournal()}>
                            <Text>SAVE</Text>
                        </TouchableOpacity>

                        {/* Title Container */}
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 20 }}>Add a journal entry</Text>
                        </View>

                        <TouchableOpacity style={{}} onPress={() => xOutOfOverlay()}>
                            <FontAwesome5 name="times" size={30} color="#000" />
                        </TouchableOpacity>
                    </View>
                    {/* Journal Content */}
                    <View style={{ justifyContent: 'center', paddingHorizontal: 20 }}>

                        {/* Add title */}
                        <Text>Add a title</Text>
                        <TextInput
                            style={[reusableStyles.textInput, titleError ? journalStyles.errorInput : null]}
                            value={journalTitle}
                            onChangeText={onTitleChange}
                        />

                        {/* Add desc */}
                        <Text>Add a description</Text>
                        <TextInput
                            style={[reusableStyles.textInput, descError ? journalStyles.errorInput : null]}
                            value={journalDesc}
                            onChangeText={onDescChange}
                        />

                        {/* Triggers today */}
                        <Text style={{ alignSelf: 'flex-start' }}>Did anything trigger you today?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' }}>
                            <TouchableOpacity
                                style={[
                                    reusableStyles.textInput,
                                    signUp.halfInput,
                                    {
                                        borderColor: selections.trigger === 'yes' ? 'blue' : '#000', // Correctly apply for "Yes"
                                    }
                                ]}
                                onPress={() => handleSelection('trigger', 'yes')}>
                                <Text>Yes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    reusableStyles.textInput,
                                    signUp.halfInput,
                                    {
                                        borderColor: selections.trigger === 'no' ? 'blue' : '#000', // Correctly apply for "No"
                                    }
                                ]}
                                onPress={() => handleSelection('trigger', 'no')}>
                                <Text>No</Text>
                            </TouchableOpacity>

                        </View>
                        <Text style={{ alignSelf: 'flex-start' }}>If 'Yes', please comment</Text>
                        <TextInput
                            style={reusableStyles.textInput}
                            value={triggerComment}
                            onChangeText={setTriggerComment}
                        />
                        <Text style={{ alignSelf: 'flex-start' }}>Did you engage in a habit of yours</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' }}>
                            <TouchableOpacity
                                style={[
                                    reusableStyles.textInput,
                                    signUp.halfInput,
                                    {
                                        borderColor: selections.engage === 'yes' ? 'blue' : '#000', // Correctly apply for "Yes"
                                    }
                                ]}
                                onPress={() => handleSelection('engage', 'yes')}>
                                <Text>Yes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    reusableStyles.textInput,
                                    signUp.halfInput,
                                    {
                                        borderColor: selections.engage === 'no' ? 'blue' : '#000', // Correctly apply for "No"
                                    }
                                ]}
                                onPress={() => handleSelection('engage', 'no')}>
                                <Text>No</Text>
                            </TouchableOpacity>

                        </View>

                        <Text style={{ alignSelf: 'flex-start' }}>Have you made any progress towards any goals today?</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' }}>
                            <TouchableOpacity
                                style={[
                                    reusableStyles.textInput,
                                    signUp.halfInput,
                                    {
                                        borderColor: selections.progress === 'yes' ? 'blue' : '#000', // Correctly apply for "Yes"
                                    }
                                ]}
                                onPress={() => handleSelection('progress', 'yes')}>
                                <Text>Yes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    reusableStyles.textInput,
                                    signUp.halfInput,
                                    {
                                        borderColor: selections.progress === 'no' ? 'blue' : '#000', // Correctly apply for "No"
                                    }
                                ]}
                                onPress={() => handleSelection('progress', 'no')}>
                                <Text>No</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ alignSelf: 'flex-start' }}>If 'Yes', what progress did you make</Text>
                        <TextInput
                            style={reusableStyles.textInput}
                            value={progressComment}
                            onChangeText={setProgressComment}
                        />
                    </View>


                </Overlay>
            )}

            {/* <JournalItem/> */}
            {/* <TouchableOpacity style={reusableStyles.textInput} onPress={addJournal}></TouchableOpacity> */}
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