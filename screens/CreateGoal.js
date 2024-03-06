import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Platform, ScrollView } from 'react-native';
import { reusableStyles, goalStyles, signUp, signUpSwipe } from '../components/styles'; // Adjust the path
import DateTimePicker from '@react-native-community/datetimepicker';


import { setGlobalData } from '../components/GoalStore'

const ActualGoals = ({ route, navigation }) => {
    const { goal, fromMain, category } = route.params;

    console.log(fromMain)

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

    setGlobalData(goal);

    const [date, setDate] = useState(new Date()); // Start date
    const [targetDate, setTargetDate] = useState(new Date()); // Initialize target date
    const [showPicker, setShowPicker] = useState(false); // Control the visibility of the start date picker
    const [showTargetPicker, setShowTargetPicker] = useState(false); // Control the visibility of the target date picker


    // const onChange = (event, selectedDate) => {
    //     const currentDate = selectedDate || date;
    //     setShowPicker(Platform.OS === 'ios' ? true : false); // Hide picker on Android after selection
    //     setDate(currentDate);
    // };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(false); // Hide picker after selection
        setDate(currentDate);
        // If the target date is before the new start date, reset it to match the start date
        if (targetDate < currentDate) {
            setTargetDate(currentDate);
        }
    };

    const onTargetChange = (event, selectedDate) => {
        const currentDate = selectedDate || targetDate;
        setShowTargetPicker(false); // Hide picker after selection
        setTargetDate(currentDate);
    };




    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;


    console.log(fromMain)
    // If fromMain then don't go to MIlestoneInfo. Else, we go to MilestoneInfo
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate(
                            fromMain ? 'MilestoneAdd' : 'MilestoneInfo',
                            {
                                goal: goal,
                                fromMain: fromMain // Ensure the key matches what you access in MilestoneAdd
                            }
                        )}
                        style={{ padding: 10, borderRadius: 5 }}
                    >
                        <Text style={{ color: 'Black', textAlign: 'center', fontSize: 16 }}>
                            {fromMain ? 'Add' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ),
        });


    }, [navigation]);

    return (
        <KeyboardAvoidingView
            behavior='position' keyboardVerticalOffset={keyboardVerticalOffset} 
            style={[reusableStyles.container, { flex: 1, alignItems: 'center' }]}>
            {/* Title Text */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
            <View style={{ marginBottom: 9 }}>
                <Text style={[signUpSwipe.description, { marginTop: 0, textAlign: 'center' }]}>
                    {goal}
                </Text>
            </View>

            <Text style={[signUpSwipe.description, { marginBottom: 9, textAlign: 'center' }]}>
                Core
            </Text>


            {/* Start Date */}
            <TouchableOpacity
                style={[reusableStyles.textInput, reusableStyles.commonView, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                onPress={() => setShowPicker(true)}
            >
                <Text style={[reusableStyles.headerText, { fontSize: 20 }]}>
                    Start Date
                </Text>
                <Text style={[reusableStyles.headerText, { fontSize: 20, fontWeight: 'normal' }]}>
                    {date.toDateString()} {/* Display the formatted start date here */}
                </Text>
            </TouchableOpacity>
            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}

            {/* Target Date Selection */}
            <TouchableOpacity
                style={[reusableStyles.textInput, reusableStyles.commonView, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                onPress={() => setShowTargetPicker(true)}
                disabled={!date} // Optionally disable until a start date is selected
            >
                <Text style={[reusableStyles.headerText, { fontSize: 20 }]} >
                    Target Date
                </Text>
                <Text style={[reusableStyles.headerText, { fontSize: 20, fontWeight: 'normal' }]}>
                    {targetDate.toDateString()} {/* Display the formatted target date here */}
                </Text>
            </TouchableOpacity>
            {showTargetPicker && (
                <DateTimePicker
                    value={targetDate}
                    mode="date"
                    display="default"
                    onChange={onTargetChange}
                    minimumDate={date} // Ensure the target date cannot be before the start date
                />
            )}

            {/* Category */}
            <View style={[reusableStyles.textInput, reusableStyles.commonView, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
            >
                <Text style={[reusableStyles.headerText, { fontSize: 20 }]} >
                    Category
                </Text>
                <Text style={[reusableStyles.headerText, { fontSize: 20, fontWeight: 'normal' }]}>
                    {category}
                </Text>
            </View>

            <Text style={[signUpSwipe.description, { marginBottom: 9, textAlign: 'center' }]}>
                Deeper
            </Text>
            {/* Starting Value */}
            <View style={[reusableStyles.textInput, reusableStyles.commonView, {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10, // Ensure padding is set according to your design
                paddingVertical: 5, // Ensure padding is set according to your design
            }]}>
                <Text style={[reusableStyles.headerText, { fontSize: 20 }]}>
                    Starting Value
                </Text>
                <TextInput
                    style={[reusableStyles.headerText, {
                        fontSize: 20,
                        fontWeight: 'normal',
                        textAlign: 'right',
                        flex: 1, // This ensures the TextInput fills the available space
                        padding: 0, // Remove padding to ensure alignment
                        // Make sure no margin is disrupting the layout
                    }]}
                    keyboardType="numeric"
                    placeholder="Enter value"
                // Additional TextInput props as needed
                />
            </View>



            {/* Numerical Target */}
            <View style={[reusableStyles.textInput, reusableStyles.commonView, {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10, // Ensure padding is set according to your design
                paddingVertical: 5, // Ensure padding is set according to your design
            }]}
            // Add onPress if you need to handle tapping on individual goals
            >
                <Text style={[reusableStyles.headerText, { fontSize: 20 }]} >
                    Numerical Target
                </Text>
                <TextInput
                    style={[reusableStyles.headerText, {
                        fontSize: 20,
                        fontWeight: 'normal',
                        textAlign: 'right',
                        flex: 1, // This ensures the TextInput fills the available space
                        padding: 0, // Remove padding to ensure alignment
                        // Make sure no margin is disrupting the layout
                    }]}
                    keyboardType="numeric"
                    placeholder="Enter value"
                // Additional TextInput props as needed
                />
            </View>

            {/* Unit */}
            <View
  style={[
    reusableStyles.textInput,
    reusableStyles.commonView,
    {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10, // Ensure padding is set according to your design
      paddingVertical: 5, // Ensure padding is set according to your design
    }
  ]}
  // Add onPress if you need to handle tapping on individual goals
>
  <Text style={[reusableStyles.headerText, { fontSize: 20 }]}>
    Unit
  </Text>
  <TextInput
    style={[
      reusableStyles.headerText,
      {
        fontSize: 20,
        fontWeight: 'normal',
        textAlign: 'right',
        flex: 1, // This ensures the TextInput fills the available space
        padding: 0, // Remove padding to ensure alignment
        // Make sure no margin is disrupting the layout
      }
    ]}
    placeholder="Enter value"
    // Additional TextInput props as needed
  />
</View>
</ScrollView>

        </KeyboardAvoidingView>
    );
};

export default ActualGoals;