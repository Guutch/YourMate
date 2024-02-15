import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { homeMain } from './styles';

const DayItem = ({ day, dayName, isToday }) => (
    <View  style={isToday ? [{backgroundColor: '#0077FF'}, homeMain.dateBorder] : homeMain.dateBorder}>
      <Text style={isToday ? [{color: '#fff', fontWeight: 'bold'}] : homeMain.dateText}>{day}</Text>
      <Text style={isToday ? [{color: '#fff', fontWeight: 'bold'}] : homeMain.dateText}>{dayName}</Text>
    </View>
  );

  export default DayItem;