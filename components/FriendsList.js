import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { communityMain } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const FriendsList = ({ friends, pressedFriend }) => {
    return (
        <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <View style={communityMain.friendBox}>
                    <View style={communityMain.userCircle}>
                        <FontAwesome5
                            name="user"
                            size={30}
                            color="#000"
                            onPress={() => pressedFriend(item)}
                        />
                    </View>
                    <View style={communityMain.nameContainer}>
                        <Text style={communityMain.userName}>
                            {`${item.firstName} ${item.lastName}`}
                        </Text>
                    </View>
                </View>
            )}
        />
    );
};

export default FriendsList;