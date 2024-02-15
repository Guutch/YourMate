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


const HomeScreen = ({ navigation }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [upcomingBlocksCount, setUpcomingBlocksCount] = useState(0);
    const [title, setTitle] = useState('Session');
    const [blockedGroup, setBlockedGroup] = useState([]); // For setting group
    const [blocks, setBlocks] = useState([]); // Blocks on screen
    const [difficulty, setDifficulty] = useState(true); // true == medium. false == hard

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];
    const formattedDate = format(currentDate, 'EEEE | MMM do yyyy');

    const startTime = new Date(new Date().getTime() - 3000000);

    const [overlayContent, setOverlayContent] = useState('options'); // 'options', 'solo', or 'delete'


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

    const [selectedHour, setSelectedHour] = useState('0');
    const [selectedMinute, setSelectedMinute] = useState('0');

    const hours = [...Array(24).keys()]; // Array of hours 0-23
    const minutes = [...Array(60).keys()].slice(1); // Array of minutes 0-59

    const handleBlockNowPress = () => {
        setShowOverlay(false); // Hide the overlay
        setOverlayContent('options'); // Reset the overlay content to 'options'
        setUpcomingBlocksCount(prevCount => prevCount + 1); // Increment the count of upcoming blocks
        setTitle('Session');

        const newBlock = {
            time: new Date().toLocaleString(), // Convert Date to a string
            title: title
        };

        // Add the new block to the blocks state
        setBlocks([...blocks, newBlock]);
    };

    // For when blocks are in the DB
    // useEffect(() => {
    //     // Fetch blocks from database
    //     const fetchBlocks = async () => {
    //       // Assuming fetchBlocksFromDb is a function that fetches blocks from your DB
    //       const blocksFromDb = await fetchBlocksFromDb();
    //       setBlocks(blocksFromDb);
    //     };

    //     fetchBlocks();
    //   }, []);

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
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
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
                                style={{ padding: 20 }}
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
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginTop: 5 }]}
                            // onPress={() => setOverlayContent('delete')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Apps Blocked</Text>
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, { alignSelf: 'center', marginTop: 5 }]}
                            // onPress={() => setOverlayContent('de lete')}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Difficulty</Text>
                                    <FontAwesome5 name="chevron-right" size={15} color="#000" />

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
                                            <Text style={homeMain.itemText}>{hour} hours</Text>
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
                                            <Text style={homeMain.itemText}>{minute} minutes</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                <TouchableOpacity style={[reusableStyles.textInput, signUp.halfInput, { borderRadius: 40 }]}>
                                    <Text style={{ color: '#000', textAlign: 'center' }}>Always Active</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[reusableStyles.textInput, signUp.halfInput, { borderRadius: 40 }]}>
                                    <Text style={{ color: '#000', textAlign: 'center' }}>Confirm</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    )}
                </Overlay>
            )}

            {/* Top Half */}
            <View>

                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>Your porn journey started...</Text>

                <JourneyTimer startTime={startTime} />

                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>...ago!</Text>

                {/* Dates List */}
                <FlatList
                    data={days}
                    renderItem={({ item }) => {
                        // Check if the item date is today's date
                        const isToday =
                            item.getDate() === currentDate.getDate() &&
                            item.getMonth() === currentDate.getMonth() &&
                            item.getFullYear() === currentDate.getFullYear();

                        return (
                            <DayItem
                                day={item.getDate()}
                                dayName={item.toLocaleString('en-us', { weekday: 'short' })}
                                isToday={isToday} // Pass this as a prop to DayItem
                            />
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
                        data={blocks}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.toString()}                     
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
                )}
            </View>


        </View>
    );
};

export default HomeScreen;