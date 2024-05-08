import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import UserModel from '../firebase/UserModel'

const StatusBoard = ({ statuses, onStatusPress, removeStatus, loggedUserName }) => {
    // You no longer need useState here for 'theStatuses'

    // Render each status within a date group
    const renderStatus = ({ item }) => (
        <View
            style={styles.statusContainer}
            onPress={() => onStatusPress(item)}
        >
            <Text style={styles.statusText}>
                {item.username} - {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
            <Text style={styles.statusText}>{item.message}</Text>
            {item.username === loggedUserName && (
                <TouchableOpacity
                    style={{ position: 'absolute', bottom: 5, right: 5 }}
                    onPress={() => removeStatus(item)}
                >
                    <FontAwesome5 name="times" size={15} color="red" />
                </TouchableOpacity>
            )}
        </View>
    );

    // Render each group of statuses
    const renderGroup = ({ item }) => (
        <View style={styles.group}>
            <Text style={styles.groupTitle}>{item.title}</Text>
            <FlatList
                data={item.statuses}
                renderItem={renderStatus}
                keyExtractor={(status) => status.id.toString()}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );

    // Prepare the data for the FlatList that renders groups
    const groupData = Object.keys(statuses).map(date => ({
        title: date,
        statuses: statuses[date],
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Status Board</Text>
            {groupData.length > 0 ? (
                <FlatList
                    data={groupData}
                    renderItem={renderGroup}
                    keyExtractor={(item) => item.title}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <Text style={{alignSelf: 'center', color: '#000'}}>No statuses, post or add a mate!</Text>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        padding: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black'
    },
    group: {
        marginBottom: 20,
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        color: 'black',
    },
    statusContainer: {
        marginBottom: 5,
        padding: 10,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
    },
    statusText: {
        fontSize: 14,
        color: 'black',
    },
});

export default StatusBoard;