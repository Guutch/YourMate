import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, homeMain, communityMain } from '../../components/styles'; // Adjust the path

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Overlay } from 'react-native-elements';

import { app } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth';

import UserModel from '../../firebase/UserModel'

const CommunityScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [startedAt, setStartedAt] = useState("");
    const [wrongUsernameBool, setWrongUsernameBool] = useState(false);
    const [dupeReq, setDupeReq] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);

    const [requests, setRequests] = useState({ sentRequests: [], receivedRequests: [] });
    const [showRequestsOverlay, setShowRequestsOverlay] = useState(false);

    const [friends, setFriends] = useState([]);

    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayContent, setOverlayContent] = useState('options'); // 'options', 'solo', or 'delete'
    const [title, setTitle] = useState('');

    const [message, setMessage] = useState("Enter your mate's username");

    const auth = getAuth();
    const currentUserId = auth.currentUser.uid;

    // const formattedStartDate = startedAt.toLocaleDateString('en-GB');
    const handleTextChange = (newText) => {
        setWrongUsernameBool(false)
        setTitle(newText); // Update the state with the new text value
        setMessage("Enter your mate's username");
        setDupeReq(false);
    };

    useEffect(() => {
        fetchUsersData();
    }, [currentUserId])

    useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => {
                            // Navigate to the next screen
                            setTitle("");
                            setDupeReq(false)
                            setShowOverlay(true);
                            setMessage("Enter your mate's username");
                            // console.log("Funny"); // Replace 'NextScreen' with the actual screen name you want to navigate to
                            // navigation.navigate('MilestoneInfo'); // Replace 'NextScreen' with the actual screen name you want to navigate to
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

    useEffect(() => {
        const fetchMates = async () => {
            try {
                const mates = await UserModel.fetchMates(currentUserId);
                console.log("mates");
                console.log(mates);

                const friends = await Promise.all(
                    mates.map(async (mate) => {
                        const otherUserId = mate.receiver === currentUserId ? mate.sender : mate.receiver;
                        const userData = await UserModel.fetchUserData(otherUserId);
                        return {
                            id: otherUserId,
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            userName: userData.userName,
                        };
                    })
                );
                console.log("mates");
                console.log(friends);

                setFriends(friends);
            } catch (error) {
                console.error("Error fetching mates:", error);
            }
        };

        fetchMates();
    }, [currentUserId]);

    // const handleAccept = async (request) => {
    //     console.log(request)
    const handleAccept = async (requestId, receiverId) => {
        try {
            const newFriend = await UserModel.handleAccept(requestId, receiverId);
            if (newFriend) {
                // Add the new friend to the friends state
                setFriends(currentFriends => [...currentFriends, newFriend]);

                // Remove the accepted request from the receivedRequests array
                setRequests(currentRequests => ({
                    ...currentRequests,
                    receivedRequests: currentRequests.receivedRequests.filter(request => request.id !== requestId),
                }));
            }
        } catch (error) {
            console.error('Error accepting friend request in component:', error);
        }
    };


    const handleRejectOrCancel = async (requestId, requestType) => {
        console.log("Hi");
        try {
            await UserModel.handleReject(requestId);
            // Update the requests state to filter out the cancelled/rejected request
            setRequests(currentRequests => {
                // Distinguish between sent and received requests for filtering
                if (requestType === 'sent') {
                    return {
                        ...currentRequests,
                        sentRequests: currentRequests.sentRequests.filter(request => request.id !== requestId),
                    };
                } else if (requestType === 'received') {
                    return {
                        ...currentRequests,
                        receivedRequests: currentRequests.receivedRequests.filter(request => request.id !== requestId),
                    };
                }
                return currentRequests; // Return unmodified state if requestType doesn't match
            });

        } catch (error) {
            console.error('Error rejecting/canceling friend request:', error);
        }
    };



    const fetchUsersData = async () => {
        try {

            const userData = await UserModel.fetchUserData(currentUserId);

            if (userData) {
                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                setUserName(userData.username);
                setStartedAt(userData.createdAt.toLocaleDateString('en-GB')); // Use the converted createdAt value
            } else {
                console.log('User data not found');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchUser = async () => {
        try {
            const userWithId = await UserModel.searchUserByUsername(title);
            if (userWithId) {
                const senderUserId = auth.currentUser.uid;
                const receiverUserId = userWithId.userId;

                // Check for existing friend connection
                const existingConnection = await UserModel.checkExistingFriendConnection(senderUserId, receiverUserId);

                if (existingConnection) {
                    // Existing connection found
                    setDupeReq(true);

                    if (existingConnection.status === 'pending') {
                        // Update message for a pending request
                        setMessage('Pending friend request already exists');
                        console.log('Pending friend request already exists');
                    } else if (existingConnection.status === 'accepted') {
                        // Update message for an accepted friend connection
                        setMessage('You are already friends');
                        console.log('You are already friends');
                    }
                } else {
                    // No existing connection, send a friend request
                    setDupeReq(false);
                    await UserModel.sendFriendRequest(senderUserId, receiverUserId);
                    console.log('Friend request sent');
                    setMessage("Enter your mate's username");
                    setRequestSuccess(true)
                    setTitle("");
                    setDupeReq(false)
                    setOverlayContent('options')
                }
            } else {
                // User not found, handle the casee
                console.log('User not found');
                setWrongUsernameBool(true);
                setMessage('Error: Incorrect username')
            }
        } catch (error) {
            console.error('Error searching user:', error);
        }

        // You may want to reset the title or perform additional actions here
    };

    return (
        <View style={[reusableStyles.container]}>

            {showOverlay && (
                <Overlay
                    isVisible={showOverlay}
                    onBackdropPress={() => {
                        setShowOverlay(false);
                        setRequestSuccess(false);
                        setTitle("");
                        setDupeReq('false')
                        setMessage("Enter your mate's username");
                        setOverlayContent('options'); // Reset the overlay content when backdrop is pressed
                    }}
                    overlayStyle={reusableStyles.overlay}
                >
                    {overlayContent === 'addMate' && (
                        <>
                            <Text style={{ padding: 20, color: wrongUsernameBool || dupeReq ? 'red' : 'black' }}>
                                {message}
                            </Text>



                            <TextInput
                                value={title}
                                onChangeText={handleTextChange}
                                style={[reusableStyles.textInput, reusableStyles.lessRounded,
                                { justifyContent: 'center', alignSelf: 'center', borderColor: wrongUsernameBool ? 'red' : 'black' }]}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>

                                <TouchableOpacity
                                    onPress={handleSearchUser}
                                    style={[
                                        reusableStyles.textInput,
                                        reusableStyles.moreRounded,
                                        { backgroundColor: "#0077FF" },
                                    ]}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "#fff" }}>
                                        Okay
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                    {overlayContent === 'options' && (
                        <>
                            <Text style={{ padding: 20 }}>
                                {requestSuccess ? "Mate request sent, what would you like to do now?" : "How would you like to proceed?"}
                            </Text>


                            <View style={{ justifyContent: 'center', marginVertical: 10, alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => setOverlayContent('addMate')}
                                    style={[
                                        reusableStyles.textInput,
                                        reusableStyles.moreRounded,
                                        { backgroundColor: "#0077FF", marginBottom: 5 },
                                    ]}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "#fff" }}>
                                        Add New Mate
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={async () => {
                                        try {
                                            const fetchedRequests = await UserModel.fetchFriendRequests(currentUserId);
                                            for (let request of fetchedRequests.sentRequests) {
                                                const userData = await UserModel.fetchUserData(request.receiver);
                                                request.receiverName = userData ? `${userData.firstName} ${userData.lastName.charAt(0)}.` : 'Unknown User';
                                            }
                                            for (let request of fetchedRequests.receivedRequests) {
                                                const userData = await UserModel.fetchUserData(request.sender);
                                                request.senderName = userData ? `${userData.firstName} ${userData.lastName.charAt(0)}.` : 'Unknown User';
                                            }
                                            setRequests(fetchedRequests);
                                            setOverlayContent('review');
                                            setShowRequestsOverlay(true);
                                        } catch (error) {
                                            console.error("Failed to fetch friend requests:", error);
                                        }
                                    }}

                                    style={[
                                        reusableStyles.textInput,
                                        reusableStyles.moreRounded,
                                        { backgroundColor: "#0077FF" },
                                    ]}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "#fff" }}>
                                        Review Requests
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                    {overlayContent === 'review' && (
                        <>
                            <View>
                                <Text>Sent Requests (Pending)</Text>
                                {requests.sentRequests.length > 0 ? (
                                    requests.sentRequests.map(request => (
                                        <View key={request.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                                            <Text>To: {request.receiverName || 'Loading...'}</Text>
                                            <TouchableOpacity onPress={() => handleRejectOrCancel(request.id, 'sent')}>
                                                <Text>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ textAlign: 'center', padding: 10 }}>There are no sent requests.</Text>
                                )}

                                <Text>Received Requests</Text>
                                {requests.receivedRequests.length > 0 ? (
                                    requests.receivedRequests.map(request => (
                                        <View key={request.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                                            <Text>From: {request.senderName || 'Loading...'}</Text>
                                            <View>
                                                <TouchableOpacity onPress={() => handleAccept(request.id, request.receiver)}>
                                                    <Text>Accept</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleRejectOrCancel(request.id, 'received')}>
                                                    <Text>Reject</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ textAlign: 'center', padding: 10 }}>There are no received requests.</Text>
                                )}
                            </View>


                        </>
                    )}

                </Overlay>
            )}

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
                    <Text>Joined {startedAt}</Text>
                    {/* Username */}
                    <Text>Username: {userName}</Text>
                </View>


            </View>
            {/* Friends piece */}
            <View style={{ marginTop: 10, padding: 10 }}>
                <Text>Friends</Text>
                {friends.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>You have not got any friends currently.</Text>
                ) : (
                    // friends.map((friend, index) => (
                        <FlatList
                            data={friends}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={communityMain.friendBox}>
                                    <View style={communityMain.userCircle}>
                                        <FontAwesome5 name="user" size={30} color="#000" onPress={() => setShowOverlay(true)} />
                                    </View>
                                    <View style={communityMain.nameContainer}>
                                        <Text style={communityMain.userName}>{`${item.firstName} ${item.lastName}`}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    // ))
                )}
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