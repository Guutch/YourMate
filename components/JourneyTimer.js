import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { homeMain } from './styles';

const JourneyTimer = ({ startTime }) => {
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        setTimeElapsed(now - startTime); // Keep timeElapsed in milliseconds
      }, 1000);
  
      return () => clearInterval(interval);
    }, [startTime]);
  
    // Calculate time units
    const secondsTotal = Math.floor(timeElapsed / 1000);
    const minutes = Math.floor(secondsTotal / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximation
    const years = Math.floor(days / 365);
  
    // Determine what to display
    let primaryUnit = '';
    let secondaryUnit = '';
    if (years > 0) {
      primaryUnit = `${years} Year${years > 1 ? 's' : ''}`;
      secondaryUnit = `${months % 12} Month${(months % 12) > 1 ? 's' : ''}`;
    } else if (months > 0) {
      primaryUnit = `${months} Month${months > 1 ? 's' : ''}`;
      secondaryUnit = `${days % 30} Day${(days % 30) !== 1 ? 's' : ''}`;
    } else if (days > 0) {
      primaryUnit = `${days} Day${days !== 1 ? 's' : ''}`;
      secondaryUnit = `${hours % 24} Hour${(hours % 24) !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      primaryUnit = `${hours} Hour${hours !== 1 ? 's' : ''}`;
      secondaryUnit = `${minutes % 60} Min`;
    } else {
      primaryUnit = `${minutes} Min`;
      secondaryUnit = `${secondsTotal % 60} Sec`;
    }
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
      <View style={homeMain.timeCircle}>
        <Text>{primaryUnit}</Text>
      </View>
      <View style={[homeMain.timeCircle, {marginLeft: 15}]}>
        <Text>{secondaryUnit}</Text>
      </View>
    </View>
    );
  };

export default JourneyTimer;