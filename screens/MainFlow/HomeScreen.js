import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, TextInput } from 'react-native';
import { reusableStyles, homeMain, signUp } from '../../components/styles'; // Adjust the path

import { Overlay } from 'react-native-elements';
import { format } from 'date-fns';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';

import JourneyTimer from '../../components/JourneyTimer';
import DayItem from '../../components/DayItem'
import BlockItem from '../../components/BlockItem'

import { app } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth';
import UserModel from '../../firebase/UserModel'

const auth = getAuth(app);
const HomeScreen = ({ navigation }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [upcomingBlocksCount, setUpcomingBlocksCount] = useState(0);
    const [title, setTitle] = useState('Session');
    const [blockedGroup, setBlockedGroup] = useState([]); // For setting group
    const [blocks, setBlocks] = useState([]); // Blocks on screen
    const [difficulty, setDifficulty] = useState(true); // true == medium. false == hard

    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialise to today's date
    const [selectedStartDate, setSelectedStartDate] = useState(new Date()); // Today's date as default


    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];
    const formattedDate = format(selectedDate, 'EEEE | MMM do yyyy');

    // this was just to tesst time the time circles. Need to remove this
    const startTime = new Date(new Date().getTime() - 3000000);

    const [overlayContent, setOverlayContent] = useState('options'); // 'options', 'solo', or 'delete'

    const [habitName, setHabitName] = useState('');
    const [habitStartDate, setHabitStartDate] = useState(null);

    useEffect(() => {
        const fetchHabit = async () => {
            try {
                const userId = auth.currentUser.uid;
                const habitData = await UserModel.fetchUserHabit(userId);
        setHabitName(habitData.name);
        setHabitStartDate(habitData.startDate);
      } catch (error) {
        console.error('Error fetching habit:', error);
      }
        };

        fetchHabit();
    }, []);

    // Helper function to generate days of the month
    const getDaysInMonth = (year, month) => {
        let date = new Date(year, month, 1);
        let days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };




    // You can replace this with the current year and month
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const days = getDaysInMonth(year, month);

    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedMinute, setSelectedMinute] = useState(45);

    const futureTime = new Date();
    futureTime.setMinutes(futureTime.getMinutes() + 15); // Set to 15 minutes in the future

    const [selectedStartHour, setSelectedStartHour] = useState(futureTime.getHours());
    const [selectedStartMinute, setSelectedStartMinute] = useState(futureTime.getMinutes());

    const [selectedInitialStartHour, setInitialSelectedStartHour] = useState(futureTime.getHours());
    const [selectedInitialStartMinute, setInitialSelectedStartMinute] = useState(futureTime.getMinutes());


    const [initialHour, setInitialHour] = useState(selectedHour);
    const [initialMinute, setInitialMinute] = useState(selectedMinute);

    const hours = [...Array(24).keys()]; // Array of hours 0-23
    const minutes = [...Array(60).keys()].slice(1); // Array of minutes 0-59

    // Ensure selectedDate is in the correct format, similar to how you store it in blocks
    const selectedDateStr = selectedDate.toISOString().split('T')[0];

    // Filter blocks for the selected date
    const blocksForSelectedDate = blocks.filter(block => block.date === selectedDateStr);

    const confirmSelection = () => {
        // Assuming there's a way to differentiate context, like a currentMode state or similar
        if (overlayContent === 'when') {
            // Update initial starting time to match the newly confirmed starting time
            setInitialSelectedStartHour(selectedStartHour);
            setInitialSelectedStartMinute(selectedStartMinute);
        }

        // Log selected time for debugging purposes
        console.log(`Selected Time: ${selectedStartHour} hours and ${selectedStartMinute} minutes`);

        // Common actions to perform after confirming selection
        setOverlayContent('solo');
    };


    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatTime = (hour, minute) => {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        return `${formattedHour}:${formattedMinute}`;
    };

    const handleBlockNowPress = async () => {
        setShowOverlay(false); // Hide the overlay
        setOverlayContent('options'); // Reset the overlay content to 'options'
        setTitle('Session');
      
        const newBlock = {
          date: selectedDate.toISOString().split('T')[0], // Store only the date part
          time: new Date().toLocaleString(), // Convert Date to a string
          title: title,
        };
      
        try {
          const userId = auth.currentUser.uid; // Assuming you have access to the authenticated user's ID
          const blockId = await UserModel.addBlock(userId, newBlock); // Add block to Firebase and get the ID
      
          // Optionally, include the block ID in your local state if needed
          const newBlockWithId = { ...newBlock, id: blockId };
          setBlocks((prevBlocks) => [...prevBlocks, newBlockWithId]);
      
          // Other state updates as needed
          // setUpcomingBlocksCount(prevCount => prevCount + 1); // Increment the count of upcoming blocks, if needed
        } catch (error) {
          console.error('Error adding block:', error);
          // Handle the error as needed
        }
      };
      

    useEffect(() => {
        // Perform actions that depend on the initial selectedHour and selectedMinute
        // This is just a placeholder; adjust according to your actual needs
        console.log(`Initial hour: ${selectedHour}, Initial minute: ${selectedMinute}`);
    }, []); // Empty dependency array means this runs once on mount


    const formatHour = (hour) => {
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Converts 0 to 12 for 12 AM
        return `${formattedHour} ${suffix}`;
    };


    const renderItem = ({ item }) => (
        <View style={homeMain.blocksContainer}>
            <BlockItem title={item.title} time={item.time} />
        </View>
    );

    const handleTextChange = (newText) => {
        setTitle(newText); // Update the state with the new text value
    };

    const renderSeparator = () => {
        return <View style={{ marginRight: 10 }} />; // Adjust the width for the desired spacing
    };

    useEffect(() => {
        console.log(blocksForSelectedDate.length)
        setUpcomingBlocksCount(blocksForSelectedDate.length)
    }, [blocksForSelectedDate])

    const resetFutureTime = () => {
        console.log("Here")
        const rightNow = new Date();
        rightNow.setMinutes(rightNow.getMinutes() + 15);
        console.log(rightNow)

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
                            // Navigate to the next screen
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

    return (
        <View style={[reusableStyles.container]}>

            {showOverlay && (
                <Overlay
                    isVisible={showOverlay}
                    onBackdropPress={() => {
                        setShowOverlay(false);
                        setSelectedMinute(45)
                        setSelectedHour(0)
                        setOverlayContent('options'); // Reset the overlay content when backdrop is pressed
                    }}
                    overlayStyle={reusableStyles.overlay}
                >
                    {overlayContent === 'options' && (
                        <>
                            <Text style={{ padding: 20 }}>What would you like to do?</Text>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                                onPress={() => setOverlayContent('solo')}
                            >
                                <Text>Solo</Text>
                            </TouchableOpacity>
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

                                <TouchableOpacity onPress={() => setOverlayContent('solo')} style={[reusableStyles.textInput, reusableStyles.moreRounded, { backgroundColor: "#0077FF" }]}>
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
                            {/* <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                                onPress={() => setOverlayContent('solo')}
                            >
                                <Text>Solo</Text>
                            </TouchableOpacity> */}

                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginTop: 5 }]}
                                onPress={() => setOverlayContent('duration')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text >Duration</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ marginRight: 10 }}>
                                            {selectedHour} : {selectedMinute}
                                        </Text>
                                        <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                    </View>
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginTop: 5 }]}
                                onPress={() => setOverlayContent('date')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Date</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ marginRight: 10 }}>
                                            {formatDate(selectedDate)}
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
                    {/*  */}
                    {overlayContent === 'delete' && (
                        <>
                            <Text style={{ padding: 20 }}>Are you sure you want to<Text style={{ color: 'red', fontWeight: 'bold' }}> delete </Text>your goal?</Text>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                            // onPress={() => setOverlayContent('delete')}
                            >
                                <Text>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center' }]}
                            // onPress={() => setOverlayContent('delete')}
                            >
                                <Text>No</Text>
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
                                        setSelectedStartHour(selectedInitialStartHour);
                                        setSelectedStartMinute(selectedInitialStartMinute);

                                        // Assuming setOverlayContent changes the overlay/content view
                                        setOverlayContent('solo');
                                    }}
                                >
                                    <Text style={{ color: '#000', textAlign: 'center' }}>Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[reusableStyles.textInput, signUp.halfInput, { borderRadius: 40 }]}
                                    onPress={confirmSelection}
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
                                <TouchableOpacity style={[reusableStyles.textInput, signUp.halfInput, { borderRadius: 40 }]}
                                    onPress={() => {

                                        setSelectedHour(initialHour);
                                        setSelectedMinute(initialMinute);
                                        setOverlayContent('solo'); // Assuming this changes the overlay/content view
                                    }}
                                >
                                    <Text style={{ color: '#000', textAlign: 'center' }}>Back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[reusableStyles.textInput, signUp.halfInput, { borderRadius: 40 }]}
                                    onPress={confirmSelection}
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

                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>Your {habitName} journey started...</Text>

                <JourneyTimer startTime={habitStartDate} />

                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>...ago!</Text>

                {/* Dates List */}
                <FlatList
                    data={days}
                    renderItem={({ item }) => {
                        const isToday = item.getDate() === new Date().getDate() &&
                            item.getMonth() === new Date().getMonth() &&
                            item.getFullYear() === new Date().getFullYear();

                        const isSelected = selectedDate && item.getDate() === selectedDate.getDate() &&
                            item.getMonth() === selectedDate.getMonth() &&
                            item.getFullYear() === selectedDate.getFullYear();

                        return (
                            <TouchableOpacity onPress={() => setSelectedDate(item)}>
                                <DayItem
                                    day={item.getDate()}
                                    dayName={item.toLocaleString('en-us', { weekday: 'short' })}
                                    isToday={isToday}
                                    isSelected={isSelected} // This prop determines if the item is highlighted
                                />
                            </TouchableOpacity>
                        );
                    }}
                    style={{ marginVertical: 15, marginRight: 5 }}
                    keyExtractor={(item) => item.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={renderSeparator}
                />

                {/* Text at bottom */}
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between', color: "#000" }]}>
                    <Text style={[{ color: "#000", fontWeight: 'bold' }]}>
                        {upcomingBlocksCount} Upcoming Blocks
                    </Text>
                    <Text style={{ color: "#000" }}>
                        {formattedDate}
                    </Text>
                </View>

            </View>

            {/* <View style={[homeMain.noBlocksContainer, { justifyContent: 'flex-start', marginTop: 9 }]}>
                <BlockItem />
            </View> */}


            {/* Bottom Half */}
            <View style={{ flex: 1 }}>
                {blocks.length === 0 ? (
                    // Display this view if there are no blocks
                    <View style={homeMain.noBlocksContainer}>
                        <Text style={homeMain.noBlocks}>Press ‘+’ to add a quick block</Text>
                        <Text style={homeMain.noBlocks}>OR</Text>
                        <Text style={homeMain.noBlocks}>
                            Go to the community page and request a shared block
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={blocksForSelectedDate} // Use the filtered blocks here
                        renderItem={renderItem} // Assuming renderItem is defined elsewhere to handle rendering each block
                        keyExtractor={(item, index) => index.toString()} // Updated keyExtractor to use index
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />

                )}
            </View>


        </View>
    );
};

export default HomeScreen;