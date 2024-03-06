import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { homeMain } from './styles';

const DayItem = ({ day, dayName, isToday, isSelected }) => (
  <View style={isSelected ? [{ backgroundColor: '#0077FF' }, homeMain.dateBorder] : isToday ? [{ backgroundColor: '#0057FF' }, homeMain.dateBorder] : homeMain.dateBorder}>
    <Text style={isSelected || isToday ? [{ color: '#fff', fontWeight: 'bold' }] : homeMain.dateText}>{day}</Text>
    <Text style={isSelected || isToday ? [{ color: '#fff', fontWeight: 'bold' }] : homeMain.dateText}>{dayName}</Text>
  </View>
);



  export default DayItem;