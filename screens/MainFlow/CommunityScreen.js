import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { View, Text, TouchableOpacity, FlatList, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, homeMain, communityMain, username } from '../../components/styles'; // Adjust the path

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import StatusBoard from '../../components/StatusBoard';
import { Overlay } from 'react-native-elements';

import { app } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth';

import UserModel from '../../firebase/UserModel'

import { getUserData, setUserData } from '../../components/DataManager';

const CommunityScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [startedAt, setStartedAt] = useState("");
    const [wrongUsernameBool, setWrongUsernameBool] = useState(false);
    const [dupeReq, setDupeReq] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);

    const [requests, setRequests] = useState({ sentRequests: [], receivedRequests: [] });
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [showRequestsOverlay, setShowRequestsOverlay] = useState(false);

    const [friends, setFriends] = useState([]);

    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayContent, setOverlayContent] = useState('options'); // 'options', 'solo', or 'delete'
    const [title, setTitle] = useState('');

    const [statuses, setStatuses] = useState([]);
    const [message, setMessage] = useState("Enter your mate's username");
    const [statusMessage, setStatusMessage] = useState('');


    const handleStatusPress = (status) => {
        // Handle the status press event
        console.log('Pressed status:', status);
    };

    const auth = getAuth();
    const [selectedFriend, setSelectedFriend] = useState({});
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

    useFocusEffect(
        React.useCallback(() => {
            const data = getUserData();

            if (data.firstName) {
                setFirstName(data.firstName);
                setUserData({ firstName: '' }); // Reset the value in UserDataManager
            }

            if (data.lastName) {
                setLastName(data.lastName);
                setUserData({ lastName: '' }); // Reset the value in UserDataManager
            }

            if (data.username) {
                setUserName(data.username);
                setUserData({ username: '' }); // Reset the value in UserDataManager
                console.log("statuses")
                console.log(statuses)
                for (const thing in statuses) {
                    console.log(thing)
                }
                console.log("Here")
            }
        }, [])
    );

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



    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedStatuses = await UserModel.fetchStatuses(currentUserId, friends);
                console.log("fetchedStatuses", fetchedStatuses)
                const formattedStatuses = fetchedStatuses.map(status => {
                    const date = new Date(status.timestamp.seconds * 1000);
                    const formattedDate = date.toISOString().substring(0, 19).replace('T', ' ');
                    return { ...status, timestamp: formattedDate };
                });
                // Group statuses by date after formatting
                const groupedStatuses = groupStatusesByDate(formattedStatuses);
                console.log("groupedStatuses")
                console.log(groupedStatuses)
                setStatuses(groupedStatuses);
            } catch (error) {
                console.error('Error fetching statusess:', error);
            }
        };
        // console.log("Thehgsuyth")

        fetchData();
    }, [currentUserId, friends, userName]); // Dependencies for refetching

    // Function to group statuses by date
    const groupStatusesByDate = (statuses) => {
        return statuses.reduce((groups, status) => {
            const date = new Date(status.timestamp);
            const formattedDate = `${date.toLocaleString('default', { weekday: 'short' })} - ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()} ${date.getFullYear()}`;

            if (!groups[formattedDate]) {
                groups[formattedDate] = [];
            }
            groups[formattedDate].push(status);
            return groups;
        }, {});
    };

    // const handleAccept = async (request) => {
    //     console.log(request)
    const handleAccept = async (requestId, receiverId, senderId) => {
        console.log("requestId", requestId);
        console.log("receiverId", receiverId);
        try {
          const newFriend = await UserModel.handleAccept(requestId, senderId);
          if (newFriend) {
            // Add the new friend to the friends state
            newFriend.id = senderId; 
            console.log("New Friend", newFriend);
            setFriends((currentFriends) => {
              const updatedFriends = [...currentFriends, newFriend];
              console.log("Updated Friends", updatedFriends); // Log the updated friends here
              return updatedFriends;
            });
      
            // Remove the accepted request from the receivedRequests array
            setRequests((currentRequests) => ({
              ...currentRequests,
              receivedRequests: currentRequests.receivedRequests.filter(
                (request) => request.id !== requestId
              ),
            }));
          }
        } catch (error) {
          console.error("Error accepting friend request in component:", error);
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
                console.log('User data not found.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const pressedFriend = (friendData) => {
        setSelectedFriend(friendData);
        setOverlayContent('pressedFriend');
        setShowOverlay(!showOverlay)
    }

    const handleDeleteMate = async (friendId) => {
        try {
            // Call the backend function to delete the friend
            await UserModel.handleDeleteFriend(currentUserId, friendId);

            // Remove the deleted friend from the friends state
            const updatedFriends = friends.filter(friend => friend.id !== friendId);
            setFriends(updatedFriends);
            cleanOverlay()
        } catch (error) {
            console.error('Error deleting friend:', error);
            // Handle error if needed
        }
    };


    const cleanOverlay = () => {
        setShowOverlay(false);
        setRequestSuccess(false);
        setTitle("");
        setDupeReq('false')
        setMessage("Enter your mate's username");
        setOverlayContent('options');
    }

    // useEffect(() => {
    //     const fetchBlockedUsers = async () => {
    //         try {
    //             const blockedUsers = await UserModel.fetchBlockedUsers(currentUserId);
    //             setBlocks(blockedUsers);
    //         } catch (error) {
    //             console.error('Error fetching blocked users:', error);
    //         }
    //     };

    //     fetchBlockedUsers();
    // }, [currentUserId]);

    const handleUnblockUser = async (blockedUser) => {
        // Implement the unblock functionality here
        console.log('Unblocking user:', blockedUser);
        console.log(blockedUsers)
        try {
            // Call the backend function to delete the friend
            await UserModel.handleReject(blockedUser.id);
            // await UserModel.handleDeleteFriend(currentUserId, blockedUserId);

            console.log(blockedUsers)
            // Remove the deleted friend from the friends state
            setBlockedUsers((prevBlockedUsers) =>
                prevBlockedUsers.filter((user) => user.id !== blockedUser.id)
            );
            console.log(blockedUsers)
            cleanOverlay()
        } catch (error) {
            console.error('Error deleting friend:', error);
            // Handle error if needed
        }

    };

    const handleBlockMate = async (friendId) => {
        try {
            // Call the backend function to block the friend
            await UserModel.handleBlockFriend(currentUserId, friendId);

            // Remove the blocked friend from the friends state
            const updatedFriends = friends.filter(friend => friend.id !== friendId);
            setFriends(updatedFriends);
            cleanOverlay()
        } catch (error) {
            console.error('Error blocking friend:', error);
            // Handle error if needed
        }
    };

    const handlePostStatus = async () => {
        try {
            // Retrieve the user document from Firestore
            //   const userDoc = await firestore.collection('users').doc(currentUserId).get();

            //   // Get the username from the user document
            //   const userName = userDoc.data().username;

            // Assuming UserModel.saveStatusToBackend posts the status to the backend
            await UserModel.saveStatusToBackend(currentUserId, statusMessage);

            // Form the new status object
            const newStatus = {
                id: Date.now().toString(), // Temporary ID, replace with backend-generated ID if available
                username: userName, // Use the retrieved username
                timestamp: new Date().toISOString(),
                message: statusMessage,
            };

            setStatusMessage('');
            setOverlayContent('options');
            setShowOverlay(false);

            // Append and re-group statuses
            setStatuses(prevStatuses => {
                // Flatten the grouped statuses back into an array
                const flattenedStatuses = Object.values(prevStatuses).flat();

                // Append the new status
                flattenedStatuses.unshift(newStatus);

                // Re-group statuses including the new one
                return groupStatusesByDate(flattenedStatuses);
            });

            // Rest of the code remains the same
            // ...
        } catch (error) {
            console.error('Error posting status:', error);
            // Handle the error appropriately
        }
    };

    // const handlePostStatus = async () => {
    //     try {
    //         // Assuming UserModel.saveStatusToBackend posts the status to the backend
    //         await UserModel.saveStatusToBackend(currentUserId, statusMessage, userName);

    //         // Form the new status object
    //         const newStatus = {
    //             id: Date.now().toString(), // Temporary ID, replace with backend-generated ID if available
    //             username: userName,
    //             timestamp: new Date().toISOString(),
    //             message: statusMessage,
    //         };

    //         // Reset the status message input and potentially dismiss overlays here
    //         setStatusMessage('');
    //         setOverlayContent('options');
    //         setShowOverlay(false);

    //         // Append and re-group statuses
    //         setStatuses(prevStatuses => {
    //             // Flatten the grouped statuses back into an array
    //             const flattenedStatuses = Object.values(prevStatuses).flat();

    //             // Append the new status
    //             flattenedStatuses.unshift(newStatus);

    //             // Re-group statuses including the new one
    //             return groupStatusesByDate(flattenedStatuses);
    //         });

    //     } catch (error) {
    //         console.error('Error posting status:', error);
    //         // Handle the error appropriately
    //     }
    // };


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
                        cleanOverlay()
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
                    {overlayContent === 'pressedFriend' && (
                        <>
                            <Text style={{ padding: 20, color: 'black' }}>
                                What would you like to do
                            </Text>


                            <View style={{ justifyContent: 'center', marginVertical: 10, alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => handleDeleteMate(selectedFriend.id)}
                                    style={[
                                        reusableStyles.textInput,
                                        reusableStyles.moreRounded,
                                        { backgroundColor: "#0077FF", marginBottom: 5 },
                                    ]}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "#fff" }}>
                                        Delete Mate
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleBlockMate(selectedFriend.id)}
                                    style={[
                                        reusableStyles.textInput,
                                        reusableStyles.moreRounded,
                                        { backgroundColor: "#0077FF", marginBottom: 5 },
                                    ]}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "#fff" }}>
                                        Block Mate
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                    {overlayContent === 'addStatus' && (
                        <>
                            <Text style={{ padding: 20, color: wrongUsernameBool || dupeReq ? 'red' : 'black' }}>
                                Write your post
                            </Text>



                            <TextInput
                                value={statusMessage}
                                onChangeText={setStatusMessage}
                                style={[
                                    reusableStyles.textInput,
                                    reusableStyles.lessRounded,
                                    { justifyContent: 'center', alignSelf: 'center', borderColor: wrongUsernameBool ? 'red' : 'black' }
                                ]}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>

                                <TouchableOpacity
                                    onPress={handlePostStatus}
                                    style={[
                                        reusableStyles.textInput,
                                        reusableStyles.moreRounded,
                                        { backgroundColor: "#0077FF" },
                                    ]}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "#fff" }}>
                                        Post Status
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
                                    onPress={() => setOverlayContent('addStatus')}
                                    style={[
                                        reusableStyles.textInput,
                                        reusableStyles.moreRounded,
                                        { backgroundColor: "#0077FF", marginBottom: 5 },
                                    ]}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "#fff" }}>
                                        Post
                                    </Text>
                                </TouchableOpacity>
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
                                        { backgroundColor: "#0077FF", marginBottom: 5 },
                                    ]}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: "#fff" }}>
                                        Review Requests
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={async () => {
                                        try {
                                            const blockedUsers = await UserModel.fetchBlockedUsers(currentUserId);
                                            const blockedUserData = [];

                                            // Fetch user data for each blocked user
                                            for (const blockedUser of blockedUsers) {
                                                if (blockedUser.blockedBy === currentUserId) {
                                                    const userData = await UserModel.fetchUserData(blockedUser.receiver);
                                                    const userName = userData
                                                        ? `${userData.firstName} ${userData.lastName.charAt(0)}.`
                                                        : 'Unknown User';
                                                    blockedUserData.push({ id: blockedUser.id, userName });
                                                }
                                            }

                                            setBlockedUsers(blockedUserData);
                                            setOverlayContent('blocks');
                                            //   setShowBlockedUsersOverlay(true);
                                        } catch (error) {
                                            console.error('Failed to fetch blocked users:', error);
                                        }
                                    }}
                                    style={[
                                        reusableStyles.textInput,
                                        reusableStyles.moreRounded,
                                        { backgroundColor: '#0077FF' },
                                    ]}
                                >
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
                                        Review Blocks
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
                                                <TouchableOpacity onPress={() => handleAccept(request.id, request.receiver, request.sender)}>
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
                    {overlayContent === 'blocks' && (
                        <>
                            <View>
                                <Text>Blocked Users</Text>
                                {blockedUsers.length > 0 ? (
                                    blockedUsers.map((blockedUser) => (
                                        <View
                                            key={blockedUser.id}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: 10,
                                            }}
                                        >
                                            <Text>{blockedUser.userName}</Text>
                                            <TouchableOpacity
                                                onPress={() => handleUnblockUser(blockedUser)}
                                            >
                                                <Text>Unblock</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ textAlign: 'center', padding: 10 }}>
                                        There are no blocked users.
                                    </Text>
                                )}
                            </View>
                        </>
                    )}

                </Overlay>
            )}

            {/* Top piece */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, padding: 10, borderBottomColor: 'black' }}>

                <View >
                    {/* Profile icon */}
                    <View style={[homeMain.timeCircle, communityMain.updatedCircle]}>
                        <FontAwesome5 name="user" size={30} color="#000" />
                    </View>
                    {/* Name */}
                    <Text style={{ color: 'black' }}>{firstName} {lastName}</Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                    {/* Joined month and year */}
                    <Text style={{ color: 'black' }}>Joined {startedAt}</Text>
                    {/* Username */}
                    <Text style={{ color: 'black' }}>Username: {userName}</Text>
                </View>


            </View>
            {/* Friends piece */}
            <View style={{ marginTop: 10, padding: 10 }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    color: 'black'
                }}>Friends</Text>
                {friends.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>You have not got any friends currently.</Text>
                ) : (
                    // friends.map((friend, index) => (
                    <FlatList
                        data={friends}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        showsVericalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={communityMain.friendBox}>
                                <View style={communityMain.userCircle}>
                                    <FontAwesome5 name="user" size={30} color="#000"
                                        onPress={() => pressedFriend(item)} />
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
            <View style={{ flex: 1, marginTop: 10, padding: 10 }}>
                {/* <Text>Status Board</Text> */}
                <StatusBoard statuses={statuses} onStatusPress={handleStatusPress} currentUserId={currentUserId} mates={friends} />
            </View>

        </View>
    );
};

export default CommunityScreen;