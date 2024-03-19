import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { goalMain, reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const BlockItem = ({ title, time, block, onItemPress }) => {
    const [borderColor, setBorderColor] = useState('#000');
    const [blockStatus, setBlockStatus] = useState('');
    const formattedTime = getFormattedTime(block);

    useEffect(() => {
        const checkBlockStatus = () => {
            const currentTime = new Date();
            const currentDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
            const blockDate = new Date(block.date); // Assuming block.date is in a format that the Date constructor can parse
            const blockDateWithoutTime = new Date(blockDate.getFullYear(), blockDate.getMonth(), blockDate.getDate());

            // First, compare dates to determine if the block is in the past, future, or today
            if (blockDateWithoutTime < currentDate) {
                setBorderColor('gray');
                setBlockStatus('Past');
                return;
            } else if (blockDateWithoutTime > currentDate) {
                setBorderColor('#000');
                setBlockStatus('Upcoming');
                return;
            }

            // If the block's date is today, then further compare times
            const { startingTime, duration } = block;
            if (startingTime && duration) {
                const startDate = new Date();
                startDate.setHours(startingTime.hours, startingTime.minutes, 0, 0);

                const endDate = new Date(startDate);
                endDate.setHours(endDate.getHours() + duration.hours);
                endDate.setMinutes(endDate.getMinutes() + duration.minutes);

                if (currentTime >= startDate && currentTime < endDate) {
                    setBorderColor('green');
                    setBlockStatus('Active');
                } else if (currentTime < startDate) {
                    setBorderColor('#000');
                    setBlockStatus('Upcoming');
                } else {
                    setBorderColor('gray');
                    setBlockStatus('Past');
                }
            }
        };

        const interval = setInterval(checkBlockStatus, 60000); // Check status every minute
        checkBlockStatus(); // Also immediately check status on effect run
        return () => clearInterval(interval);
    }, [block]); // Effect depends on the block object


    return (
        <View style={{ position: 'relative' }}>
            <TouchableOpacity
                onPress={() => onItemPress(block.id)}
                style={[
                    reusableStyles.textInput,
                    { height: 68, borderColor: borderColor, borderWidth: 3 },
                    reusableStyles.lessRounded,
                ]}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text>{title}</Text>
                        <Text>{formattedTime}</Text>
                    </View>
                    <FontAwesome5 name="chevron-right" size={15} color="#000" />
                </View>
            </TouchableOpacity>
            {blockStatus && (
                <Text style={{ textAlign: 'right', marginRight: 10, color: blockStatus === 'Active' ? 'green' : 'gray' }}>
                    {blockStatus}
                </Text>
            )}
        </View>
    );
};



const getFormattedTime = (block) => {
    if (!block.startingTime || !block.duration) {
        return block.time;
    }

    const { startingTime, duration } = block;
    const startHour = startingTime.hours.toString().padStart(2, '0');
    const startMinute = startingTime.minutes.toString().padStart(2, '0');
    const startTimeString = `${startHour}:${startMinute}`;

    const durationHours = duration.hours;
    const durationMinutes = duration.minutes;

    const startDate = new Date();
    startDate.setHours(startingTime.hours);
    startDate.setMinutes(startingTime.minutes);

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + durationHours);
    endDate.setMinutes(endDate.getMinutes() + durationMinutes);

    const endHour = endDate.getHours().toString().padStart(2, '0');
    const endMinute = endDate.getMinutes().toString().padStart(2, '0');
    const endTimeString = `${endHour}:${endMinute}`;

    return `From ${startTimeString} - ${endTimeString}`;
};

export default BlockItem;