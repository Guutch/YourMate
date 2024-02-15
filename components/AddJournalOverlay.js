import React from 'react';
import { View, Text, FlatList, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { goalMain, reusableStyles } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const AddJournalOverlay = ({ title, time }) => (
{/* <TouchableOpacity style={[reusableStyles.textInput, { height: 68 }, reusableStyles.lessRounded]}>


<View style={[{ flexDirection: 'row', justifyContent: 'space-between', color: "#000", alignItems: 'center' }]}>
    <View style={{ justifyContent: 'center' }}>
        <Text numberOfLines={1}>Title</Text>

    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

        <Text style={{ paddingRight: 9 }}>Date</Text>
        <FontAwesome5 name="clock" size={15} color="#000" />
    </View>


</View>
<Text numberOfLines={1}>Description add  lolDescription Description Description Description</Text>
</TouchableOpacity> */}
);

export default AddJournalOverlay;