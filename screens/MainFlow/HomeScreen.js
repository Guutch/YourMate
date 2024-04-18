import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import { reusableStyles, homeMain, signUp } from '../../components/styles'; // Adjust the path
import { useFocusEffect } from '@react-navigation/native';
import { Overlay } from 'react-native-elements';
import { format } from 'date-fns';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';

import JourneyTimer from '../../components/JourneyTimer';
import DayItem from '../../components/DayItem'
import MonthItem from '../../components/MonthItem'
import BlockItem from '../../components/BlockItem'

import { app } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth';
import UserModel from '../../firebase/UserModel'

import { getUserData, setUserData } from '../../components/DataManager';


const auth = getAuth(app);
const HomeScreen = ({ navigation }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [upcomingBlocksCount, setUpcomingBlocksCount] = useState(0);
    const [title, setTitle] = useState('Session');
    const [blocks, setBlocks] = useState([]); // Blocks on screen

    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialise to today's date


    const currentDate = new Date();
    const formattedDate = format(selectedDate, 'EEEE | MMM do yyyy');

    const [habits, setHabits] = useState([])

    // this was just to tesst time the time circles. Need to remove this
    // const startTime = new Date(new Date().getTime() - 3000000);

    const [overlayContent, setOverlayContent] = useState('solo'); // 'options', 'solo', or 'delete'

    const [habitName, setHabitName] = useState('');
    const [habitStartDate, setHabitStartDate] = useState(null);

    const userId = auth.currentUser.uid;

    const [currentHabitIndex, setCurrentHabitIndex] = useState(0);

    const navigateToPreviousHabit = () => {
        if (currentHabitIndex > 0) {
            setCurrentHabitIndex(currentHabitIndex - 1);
        }
    };

    const navigateToNextHabit = () => {
        if (currentHabitIndex < habits.length - 1) {
            setCurrentHabitIndex(currentHabitIndex + 1);
        }
    };

    const currentHabit = habits[currentHabitIndex];

    useFocusEffect(
        React.useCallback(() => {
            const data = getUserData();
            if (data.habit) {
                fetchHabits()
                setUserData({ habit: '' })
            }
        }, [])
    );

    const fetchHabits = async () => {
        try {
            const habitsData = await UserModel.fetchUserHabit(userId);
            console.log(habitsData)
            setHabits(habitsData);
        } catch (error) {
            console.log('Error fetching habits:', error);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchBlocks = async () => {
        try {
            const blocksData = await UserModel.fetchUserBlocks(userId);
            setBlocks(blocksData);
        } catch (error) {
            console.log('Error fetching blocks:', error);
        }
    };

    useEffect(() => {
        fetchBlocks();
    }, [userId]);

    // Helper function to generate days of the month
    const getDaysInMonth = (year, month) => {

        let date = new Date(Date.UTC(year, month, 1)); // Create a new Date with UTC time
        let days = [];

        while (date.getUTCMonth() === month) { // Check the UTC month
            days.push(new Date(date)); // Create a new Date object without modifying the original
            date.setUTCDate(date.getUTCDate() + 1); // Update the date using UTC methods
        }

        // console.log(days);
        return days;
    };

    const handleMonthChange = (monthOffset) => {
        const nextMonth = currentMonth + monthOffset;
        const nextYear = nextMonth >= 12 ? currentYear + 1 : currentYear; // Increment year if needed
        const adjustedMonth = nextMonth >= 12 ? nextMonth - 12 : nextMonth; // Adjust for new year

        setCurrentYear(nextYear);
        setCurrentMonth(adjustedMonth);
        setDays(getDaysInMonth(nextYear, adjustedMonth));
    };



    // You can replace this with the current year and month
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [days, setDays] = useState(getDaysInMonth(currentYear, currentMonth));

    const [selectedBlock, setSelectedBlock] = useState(null);

    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedMinute, setSelectedMinute] = useState(45);

    const futureTime = new Date();
    futureTime.setMinutes(futureTime.getMinutes() + 15); // Set to 15 minutes in the future

    const [selectedStartHour, setSelectedStartHour] = useState(futureTime.getHours());
    const [selectedStartMinute, setSelectedStartMinute] = useState(futureTime.getMinutes());

    const [selectedInitialStartHour, setInitialSelectedStartHour] = useState(futureTime.getHours());
    const [selectedInitialStartMinute, setInitialSelectedStartMinute] = useState(futureTime.getMinutes());

    const [selectedBlockId, setSelectedBlockId] = useState(null);

    const [initialHour, setInitialHour] = useState(selectedHour);
    const [initialMinute, setInitialMinute] = useState(selectedMinute);

    const hours = [...Array(24).keys()]; // Array of hours 0-23
    const minutes = [...Array(60).keys()].slice(1); // Array of minutes 0-59

    const selectedDateStr = selectedDate.toISOString().split('T')[0];

    // Filter blocks for the selected date
    const blocksForSelectedDate = blocks && blocks.length > 0
        ? blocks.filter(block => block.date === selectedDateStr)
        : [];


    const confirmSelection = () => {
        // Assuming there's a way to differentiate context, like a currentMode state or similar
        if (overlayContent === 'when') {
            // Update initial starting time to match the newly confirmed starting time
            setInitialSelectedStartHour(selectedStartHour);
            setInitialSelectedStartMinute(selectedStartMinute);
        }

        // Common actions to perform after confirming selection
        setOverlayContent('solo');
    };

    const formatTime = (hour, minute) => {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        return `${formattedHour}:${formattedMinute}`;
    };


    const handleDeleteBlock = async (selectedBlockId) => {
        try {
            // console.log("selectedBlockId")
            // console.log(selectedBlockId)
            // Delete the block from Firestore
            await UserModel.deleteBlock(userId, selectedBlockId);

            // Update the blocks state by filtering out the deleted block
            setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== selectedBlockId));
            setShowOverlay(false);
            setOverlayContent('solo');

        } catch (error) {
            console.error('Error deleting block:', error);
            // Handle the error appropriately
        }
    }

    const handleBlockNowPress = async () => {

        // console.log(selectedDate.toISOString().split('T')[0])

        setShowOverlay(false); // Hide the overlay
        setOverlayContent('solo'); // Reset the overlay content to 'options'


        const newBlock = {
            date: selectedDate.toISOString().split('T')[0], // Store only the date part
            time: new Date().toLocaleString(), // Convert Date to a string
            title: title,
            duration: {
                hours: selectedHour,
                minutes: selectedMinute,
            },
            startingTime: {
                hours: selectedStartHour,
                minutes: selectedStartMinute,
            },
        };

        try {
            const userId = auth.currentUser.uid; // Assuming you have access to the authenticated user's ID
            // console.log('User ID:', userId);
            const blockId = await UserModel.addBlock(userId, newBlock); // Add block to Firebase and get the ID
            // console.log('Block added with ID:', blockId);
            // Optionally, include the block ID in your local state if needed
            const newBlockWithId = { ...newBlock, id: blockId };
            // console.log('New block with ID:', newBlockWithId);
            // console.log("blocks")
            // console.log(blocks)
            setBlocks((prevBlocks) => {
                if (prevBlocks === undefined) {
                    return [newBlockWithId]; // If prevBlocks is undefined, return a new array with the new block
                } else {
                    return [...prevBlocks, newBlockWithId]; // Otherwise, spread the existing blocks and add the new block
                }
            });
            console.log('Blocks state updated');
            setTitle('Session');
            setSelectedHour(0)
            setSelectedMinute(45)

            // setUpcomingBlocksCount(prevCount => prevCount + 1); // Increment the count of upcoming blocks, if needed
        } catch (error) {
            console.log('Error adding block:', error); // Handle the error as needed
        }
    };


    const formatHour = (hour) => {
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Converts 0 to 12 for 12 AM
        return `${formattedHour} ${suffix}`;
    };

    const handleBlockPress = (blockId) => {
        const selectedBlock = blocks.find((block) => block.id === blockId);
        // console.log("This is the blockID for shit: ", blockId)
        setSelectedBlock(selectedBlock);
        setIsModifying(true); // Set isModifying to true when modifying an existing block
        // console.log("selectedBlock")
        // console.log(selectedBlock)
        setOverlayContent('blockOpts');
        setShowOverlay(!showOverlay);
    };

    const renderItem = ({ item }) => (
        <View style={homeMain.blocksContainer}>
            <BlockItem
                title={item.title}
                time={item.time}
                block={item}
                onItemPress={handleBlockPress}
            />
        </View>
    );

    const handleTextChange = (newText) => {
        setTitle(newText); // Update the state with the new text value
    };

    const renderSeparator = () => {
        return <View style={{ marginRight: 10 }} />; // Adjust the width for the desired spacing
    };

    useEffect(() => {
        setUpcomingBlocksCount(blocksForSelectedDate.length)
    }, [blocksForSelectedDate])

    const resetFutureTime = () => {
        // console.log("Here")
        const rightNow = new Date();
        rightNow.setMinutes(rightNow.getMinutes() + 15);
        // console.log(rightNow)

        setInitialSelectedStartHour(rightNow.getHours());
        setInitialSelectedStartMinute(rightNow.getMinutes());
    };


    useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => {
                            setOverlayContent('rewind')
                            setShowOverlay(true);
                            console.log("Rewind time")
                        }}
                        style={{
                            padding: 10,
                            borderRadius: 5,
                        }}
                    >
                        <FontAwesome5 name="history" size={30} color="#000" />
                        {/* <FontAwesome5 name="clock" size={30} color="#000" onPress={() => setShowOverlay(true)} /> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            resetFutureTime();
                            console.log("lol")
                            setShowOverlay(true);
                        }}
                        style={{
                            padding: 10,
                            borderRadius: 5,
                        }}
                    >
                        <FontAwesome5 name="plus" size={30} color="#000" />
                        {/* <FontAwesome5 name="clock" size={30} color="#000" onPress={() => setShowOverlay(true)} /> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            // Navigate
                            navigation.navigate('Settings'); // Replace  'NextScreen' with the actual screen name you want to navigate to
                        }}
                        style={{
                            padding: 10,
                            borderRadius: 5,
                        }}
                    >
                        <FontAwesome5 name="cog" size={30} color="#000" />


                    </TouchableOpacity >
                </View>),
        });
    }, [navigation]);

    const getMonthName = (monthIndex) => {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
            'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
        ];
        return monthNames[monthIndex];
    }

    const [isModifying, setIsModifying] = useState(false);

    const updateSelectedBlock = async (updatedProperties, modificationType) => {
        const updatedBlock = { ...selectedBlock, ...updatedProperties };
        const updatedBlocks = blocks.map((block) =>
            block.id === selectedBlock.id ? updatedBlock : block
        );

        try {
            switch (modificationType) {
                case 'title':
                    // Call the Firebase function to update the block title.
                    await UserModel.updateBlockTitleInFirebase(userId, selectedBlock.id, updatedBlock.title);
                    break;
                case 'duration':
                    // Call the Firebase function to update the block duration
                    await UserModel.updateBlockDurationInFirebase(userId, selectedBlock.id, updatedBlock.duration);
                    break;
                case 'startingTime':
                    await UserModel.updateBlockStartingTimeInFirebase(userId, selectedBlock.id, updatedBlock.startingTime);
                    break;
                default:
                    break;
            }

            setBlocks(updatedBlocks);
            fetchBlocks();
            setOverlayContent('blockOpts');
        } catch (error) {
            console.error('Error updating block data:', error);
            // Handle the error, e.g., show an error message to the user
        }
    };

    return (
        <View style={[reusableStyles.container]}>

            {showOverlay && (
                <Overlay
                    isVisible={showOverlay}
                    onBackdropPress={() => {
                        setShowOverlay(false);
                        setIsModifying(false);
                        setSelectedMinute(45)
                        setSelectedHour(0)
                        setTitle('Session')
                        setOverlayContent('solo'); // Reset the overlay content when backdrop is pressed
                    }}
                    overlayStyle={reusableStyles.overlay}
                >
                    {overlayContent === 'rewind' && (
                        <>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "#000" }}>
                                    Would you like to reset the timer for {currentHabit.name}
                                </Text>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginVertical: 10, paddingHorizontal: 10 }}>
                                    <TouchableOpacity
                                        style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginVertical: 10 }]}
                                        onPress={async () => {
                                            console.log(currentHabit);
                                            try {
                                                await UserModel.updateHabitTime(userId, currentHabit.id);
                                                setShowOverlay(false);
                                                setOverlayContent('solo');
                                                fetchHabits()
                                            } catch (error) {
                                                // Handle the error appropriately 
                                            }
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', color: "#000" }}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[reusableStyles.textInput, reusableStyles.moreRounded]}
                                        onPress={() => {
                                            setShowOverlay(false); // Close the overlay on 'No' press
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', color: "#000" }}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </>
                    )}
                    {overlayContent === 'titleChange' && (
                        <>
                            <TextInput
                                value={title}
                                onChangeText={handleTextChange}
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { justifyContent: 'center', alignSelf: 'center' }]}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isModifying) {
                                            // Update block title
                                            if (isModifying) {
                                                updateSelectedBlock({ title }, 'title');
                                            }
                                            // const updatedBlock = { ...selectedBlock, title };
                                            // const updatedBlocks = blocks.map((block) => (block.id === selectedBlock.id ? updatedBlock : block));
                                            // setBlocks(updatedBlocks);
                                            // setOverlayContent('blockOpts');
                                        } else {
                                            // Create a new block
                                            const newBlock = { id: Date.now(), title, duration: 0, startTime: '00:00' };
                                            setBlocks([...blocks, newBlock]);
                                            setOverlayContent('solo');
                                        }
                                    }}
                                    style={[reusableStyles.textInput, reusableStyles.moreRounded, { backgroundColor: "#0077FF" }]}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "#fff" }}>Okay</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                    {overlayContent === 'solo' && (
                        <>
                            <TouchableOpacity onPress={() => setOverlayContent('titleChange')} style={{ flexDirection: 'row', padding: 20 }}>
                                <Text style={{ textAlign: 'left', color: "#000" }}>{title}</Text>
                                <FontAwesome5 name="pen" size={15} color="#000" style={{ paddingLeft: 10 }} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginTop: 5 }]}
                                onPress={() => setOverlayContent('duration')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text >Duration</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ marginRight: 10 }}>
                                            {selectedHour} : {selectedMinute < 10 ? '0' + selectedMinute : selectedMinute}
                                        </Text>

                                        <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                    </View>
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginTop: 5 }]}
                                onPress={() => setOverlayContent('when')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Starting time</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ marginRight: 10 }}>
                                            {formatTime(selectedInitialStartHour, selectedInitialStartMinute)}
                                        </Text>
                                        <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                    </View>
                                </View>



                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>

                                <TouchableOpacity onPress={handleBlockNowPress} style={[reusableStyles.textInput, reusableStyles.moreRounded, { backgroundColor: "#0077FF" }]}>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "#fff" }}>Block Now</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                    {overlayContent === 'delete' && (
                        <>
                            <Text style={{ padding: 20 }}>Are you sure you want to<Text style={{ color: 'red', fontWeight: 'bold' }}> delete </Text>this block?</Text>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginBottom: 10 }]}
                                onPress={() => handleDeleteBlock(selectedBlock.id)}
                            >
                                <Text>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                                onPress={() => setOverlayContent('blockOpts')}
                            >
                                <Text>No</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {overlayContent === 'blockOpts' && (
                        <>
                            <Text style={{ padding: 20, color: 'black' }}>What would you like to do with this block</Text>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginBottom: 10 }]}
                                onPress={() => {
                                    setOverlayContent('titleChange');
                                    setTitle(selectedBlock.title);
                                }}
                            >
                                <Text style={{ color: '#000' }}>Modify Block's Name</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginBottom: 10 }]}
                                onPress={() => setOverlayContent('duration')}
                            >
                                <Text style={{ color: '#000' }}>Modify Block's Duration</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginBottom: 10 }]}
                                onPress={() => setOverlayContent('when')}
                            >
                                <Text style={{ color: '#000' }}>Modify Block's Starting Time</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                                onPress={() => setOverlayContent('delete')}
                            >
                                <Text style={{ color: '#000' }}>Delete Block</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {overlayContent === 'when' && (
                        <View>
                            <Text style={homeMain.title}>Starting time</Text>
                            <View style={homeMain.pickerContainer}>
                                <ScrollView style={homeMain.scrollPicker}>
                                    {hours.map((hour) => (
                                        <TouchableOpacity
                                            key={hour}
                                            style={homeMain.item}
                                            onPress={() => setSelectedStartHour(hour)}
                                        >
                                            <Text
                                                style={[
                                                    homeMain.itemText,
                                                    selectedStartHour === hour ? { color: '#0077ff' } : { color: '#000' }
                                                ]}
                                            >
                                                {formatHour(hour)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                <ScrollView style={homeMain.scrollPicker}>
                                    {minutes.map((minute) => (
                                        <TouchableOpacity
                                            key={minute}
                                            style={homeMain.item}
                                            onPress={() => setSelectedStartMinute(minute)}
                                        >
                                            <Text
                                                style={[
                                                    homeMain.itemText,
                                                    selectedStartMinute === minute ? { color: '#0077ff' } : { color: '#000' }
                                                ]}
                                            >
                                                {minute === 1 ? `${minute} minute` : `${minute} minutes`}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                <TouchableOpacity
                                    style={[reusableStyles.textInput, signUp.halfInput, { borderRadius: 40 }]}
                                    onPress={() => {
                                        // Reset the selected start hour and minute to their initial values
                                        if (isModifying) {
                                            // If modifying, reset to the block's current starting time values
                                            setSelectedStartHour(selectedBlock.startingTime.hours);
                                            setSelectedStartMinute(selectedBlock.startingTime.minutes);
                                        } else {
                                            // If not modifying, reset to the initial start hour and minute values
                                            setSelectedStartHour(selectedInitialStartHour);
                                            setSelectedStartMinute(selectedInitialStartMinute);
                                        }
                                        // Assuming setOverlayContent changes the overlay/content view
                                        setOverlayContent(isModifying ? 'blockOpts' : 'solo');
                                    }}
                                >
                                    <Text style={{ color: '#000', textAlign: 'center' }}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[reusableStyles.textInput, signUp.halfInput, { borderRadius: 40 }]}
                                    onPress={() => {
                                        if (isModifying) {
                                            // // Update the existing block's starting time
                                            updateSelectedBlock(
                                                { startingTime: { hours: selectedStartHour, minutes: selectedStartMinute } },
                                                'startingTime'
                                            );
                                            // const updatedBlock = {
                                            //     ...selectedBlock,
                                            //     startingTime: { hours: selectedStartHour, minutes: selectedStartMinute }
                                            // };
                                            // const updatedBlocks = blocks.map((block) =>
                                            //     block.id === selectedBlock.id ? updatedBlock : block
                                            // );
                                            // setBlocks(updatedBlocks);
                                            // setOverlayContent('blockOpts'); // Navigate back to the block options
                                        } else {
                                            confirmSelection()
                                        }
                                    }}
                                >
                                    <Text style={{ color: '#000', textAlign: 'center' }}>Confirm</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    )}
                    {overlayContent === 'duration' && (
                        <View>
                            <Text style={homeMain.title}>Duration</Text>
                            <View style={homeMain.pickerContainer}>
                                <ScrollView style={homeMain.scrollPicker}>
                                    {hours.map((hour) => (
                                        <TouchableOpacity
                                            key={hour}
                                            style={homeMain.item}
                                            onPress={() => setSelectedHour(hour)}
                                        >
                                            <Text
                                                style={[
                                                    homeMain.itemText,
                                                    selectedHour === hour ? { color: '#0077ff' } : { color: '#000' }
                                                ]}
                                            >
                                                {hour} hours
                                            </Text>
                                        </TouchableOpacity>

                                    ))}
                                </ScrollView>
                                <ScrollView style={homeMain.scrollPicker}>
                                    {minutes.map((minute) => (
                                        <TouchableOpacity
                                            key={minute}
                                            style={homeMain.item}
                                            onPress={() => setSelectedMinute(minute)}
                                        >
                                            <Text
                                                style={[
                                                    homeMain.itemText,
                                                    selectedMinute === minute ? { color: '#0077ff' } : { color: '#000' }
                                                ]}
                                            >
                                                {minute === 1 ? `${minute} minute` : `${minute} minutes`}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                <TouchableOpacity
                                    style={[reusableStyles.textInput, signUp.halfInput, { borderRadius: 40 }]}
                                    onPress={() => {
                                        if (isModifying) {
                                            // Update block duration
                                            setSelectedHour(selectedBlock.duration.hours);
                                            setSelectedMinute(selectedBlock.duration.minutes);
                                        } else {
                                            // Reset to initial values if not modifying (e.g., creating a new block)
                                            setSelectedHour(initialHour);
                                            setSelectedMinute(initialMinute);
                                        }
                                        // Navigate back appropriately
                                        setOverlayContent(isModifying ? 'blockOpts' : 'solo');
                                    }}
                                >
                                    <Text style={{ color: '#000', textAlign: 'center' }}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[reusableStyles.textInput, signUp.halfInput, { borderRadius: 40 }]}
                                    onPress={() => {
                                        if (isModifying) {
                                            // Update the existing block's duration
                                            updateSelectedBlock({ duration: { hours: selectedHour, minutes: selectedMinute } }, 'duration');

                                            // const updatedBlock = {
                                            //     ...selectedBlock,
                                            //     duration: { hours: selectedHour, minutes: selectedMinute }
                                            // };
                                            // const updatedBlocks = blocks.map((block) =>
                                            //     block.id === selectedBlock.id ? updatedBlock : block
                                            // );
                                            // setBlocks(updatedBlocks);
                                            // setOverlayContent('blockOpts'); // Navigate back to the block options
                                        } else {
                                            // Include logic here for what happens when a new duration is confirmed and not modifying
                                            // For instance, creating a new block or any other appropriate action
                                            confirmSelection(); // This is the updated function name you will use
                                        }
                                    }}
                                >
                                    <Text style={{ color: '#000', textAlign: 'center' }}>Confirm</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    )}
                </Overlay>
            )}

            {/* Top Half */}
            <View>


                {currentHabit && (
                    <>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>Your {currentHabit.name} journey started...</Text>
                        <JourneyTimer
                            key={currentHabit.id}
                            startTime={currentHabit.startDate}
                            habitName={currentHabit.name}
                            showLeftChevron={currentHabitIndex !== 0}
                            showRightChevron={currentHabitIndex !== habits.length - 1}
                            totalHabits={habits.length}
                            currentIndex={currentHabitIndex}
                            navigateToPreviousHabit={navigateToPreviousHabit}
                            navigateToNextHabit={navigateToNextHabit}
                        />
                    </>

                )}

                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>...ago!</Text>

                {/* Dates List */}
                <FlatList
                    data={days}
                    renderItem={({ item }) => {
                        const isToday =
                            item.getDate() === new Date().getDate() &&
                            item.getMonth() === new Date().getMonth() &&
                            item.getFullYear() === new Date().getFullYear();
                        const isSelected =
                            selectedDate &&
                            item.getDate() === selectedDate.getDate() &&
                            item.getMonth() === selectedDate.getMonth() &&
                            item.getFullYear() === selectedDate.getFullYear();
                        return (
                            <TouchableOpacity onPress={() => {
                                setSelectedDate(item);
                            }}>
                                <DayItem
                                    day={item.getDate()}
                                    dayName={item.toLocaleString('en-us', { weekday: 'short' })}
                                    isToday={isToday}
                                    isSelected={isSelected}
                                />
                            </TouchableOpacity>
                        );
                    }}
                    style={{ marginVertical: 15, marginRight: 5 }}
                    keyExtractor={(item) => item.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={renderSeparator}
                    ListHeaderComponent={
                        <MonthItem
                            left={true}
                            monthName={getMonthName(currentMonth === 0 ? 11 : currentMonth - 1)}
                            onPress={() => handleMonthChange(-1)}
                        />
                    }
                    ListFooterComponent={
                        <MonthItem
                            left={false}
                            monthName={getMonthName(currentMonth === 11 ? 0 : currentMonth + 1)}
                            onPress={() => handleMonthChange(1)}
                        />
                    }
                />

                {/* Text at bottom */}
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between', color: "#000" }]}>
                    <Text style={[{ color: "#000", fontWeight: 'bold' }]}>
                        {upcomingBlocksCount} Blocks
                    </Text>
                    <Text style={{ color: "#000", fontWeight: 'bold' }}>
                        {formattedDate}
                    </Text>
                </View>

            </View>

            {/* <View style={[homeMain.noBlocksContainer, { justifyContent: 'flex-start', marginTop: 9 }]}>
                <BlockItem />
            </View> */}


            {/* Bottom Half */}
            <View style={{ flex: 1 }}>
                {blocksForSelectedDate.length === 0 ? (
                    // Display this view if there are no blocks
                    <View style={homeMain.noBlocksContainer}>
                        <Text style={[homeMain.noBlocks, { fontWeight: 'bold' }]}>There are no blocks scheduled for today</Text>
                        <Text style={[homeMain.noBlocks, { fontWeight: 'bold' }]}>
                            Press ‘+’ to add a block
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={blocksForSelectedDate} // Use the filtered blocks here
                        renderItem={renderItem} // Assuming renderItem is defined elsewhere to handle rendering each block
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />

                )}
            </View>


        </View>
    );
};

export default HomeScreen;