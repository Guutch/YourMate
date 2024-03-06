import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, landing, signUp, signUpSwipe } from '../components/styles'; // Adjust the path


const MilestonneInfo = ({ navigation, route }) => {
//     const { selected, showOverlay, setShowOverlay, fromMain } = route.params;

// useEffect(() => {
//         if (!fromMain) {
//             navigation.setOptions({
//                 headerRight: () => (
//                     <View style={{ flexDirection: 'row' }}>
//                         <TouchableOpacity
//                             onPress={() => navigation.navigate('Housekeeping')}
//                             // onPress={() => navigation.setParams({ color: 'red' })}
//                             style={{ padding: 10, borderRadius: 5 }}
//                         >
//                             <Text style={{ color: 'Black', textAlign: 'center', fontSize: 16 }}>
//                                 Skip
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 ),
//             })
//         }

//     }, [navigation]);
    return (
        <View style={[reusableStyles.container]}>
            {/* Header Text */}
            <Text style={[reusableStyles.headerText, { marginBottom: 9 }]}>
                Milestones
            </Text>
            <Text style={[signUpSwipe.description, { marginTop: 0, textAlign: 'center' }]}>
                    Feel free to add all stepping stones (milestones) that need to be accomplished to achieve the long-term goal!
                </Text>

            {/* Add Button */}
            <TouchableOpacity style={[reusableStyles.button, { backgroundColor: '#0077FF', marginTop: 15, borderWidth: 1, width: 335 }]}
                // Need to pass the goal data through and that
                onPress={() => navigation.navigate('MilestoneAdd')}
            >
                <Text style={reusableStyles.buttonText}>Add New Milestone</Text>
            </TouchableOpacity>
            {/* Add Button */}
            <TouchableOpacity style={[reusableStyles.button, { backgroundColor: '#0077FF', marginTop: 15, borderWidth: 1, width: 335 }]}
                // Need to pass the goal data through
                onPress={() => navigation.navigate('MainFlow')}
            >
                <Text style={reusableStyles.buttonText}>Skip This Step</Text>
            </TouchableOpacity>

        </View>
    );
};

export default MilestonneInfo;