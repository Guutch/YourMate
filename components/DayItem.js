import React from 'react';
import { View, Text } from 'react-native';
import { homeMain } from './styles';


// Component that shows days within HomeScreen.js
const DayItem = ({ day, dayName, isToday, isSelected }) => (
  // This component renders a view representing a day of the month
  // Styles are applied to the view depending on what day has been selected by the user

  // If the day has been selected, a blue background and border style are applied
  // If the day is today's date, a dark blue and border style is applied to highlight this
  <View style={isSelected ? [{ backgroundColor: '#0077FF' }, homeMain.dateBorder] : isToday ? [{ backgroundColor: '#0057FF' }, homeMain.dateBorder] : homeMain.dateBorder}>
    {/*
      If the day is selected, or it's today's date then the text is white and bold 
      Otherwise, homeMain.dateText is applied
    */}
    <Text style={isSelected || isToday ? [{ color: '#fff', fontWeight: 'bold' }] : homeMain.dateText}>{day}</Text>
    <Text style={isSelected || isToday ? [{ color: '#fff', fontWeight: 'bold' }] : homeMain.dateText}>{dayName}</Text>
  </View>
);



export default DayItem;