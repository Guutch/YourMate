import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { homeMain } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const MonthItem = ({ left, monthName, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[homeMain.dateBorder, left ? { marginRight: 10 } : { marginLeft: 10 }]}>
      <View style={homeMain.dateBorder}> 
      <Text style={homeMain.dateText}>{monthName}</Text>
        {left === true && <FontAwesome5 name="chevron-left" size={15} color="#000" />}
       
        {left === false && <FontAwesome5 name="chevron-right" size={15} color="#000" />}
      </View>
    </TouchableOpacity>
  );



  export default MonthItem;