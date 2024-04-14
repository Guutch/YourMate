import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { reusableStyles, goalMain } from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const NoteComponent = ({ noteTitle, noteText, noteDate, onDeletePress}) => (
  <View style={styles.container}>
    <TouchableOpacity style={[reusableStyles.button, styles.noteButton]}>
      <Text style={styles.noteTitle}>{noteTitle}</Text>
      <Text style={styles.noteText}>{noteText}</Text>
      <TouchableOpacity onPress={onDeletePress}
      style={[styles.noteDate, {padding: 3, width: 30, height: 30, borderRadius: 13, borderWidth: 2, justifyContent: 'center', alignItems: 'center'}]}>
        <FontAwesome5 name="times" size={15} color="#000" />
      </TouchableOpacity>
      <Text style={styles.noteDate}>{noteDate}</Text>
      
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    // borderBottomWidth: 1,
    padding: 10,
    borderBottomColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteButton: {
    backgroundColor: 'white',
    padding: 10,
    borderColor: '#000',
    borderWidth: 2,
    height: 'auto',
  },
  noteTitle: {
    alignSelf: 'center', // Centrally aligns the title
    fontWeight: 'bold',
    marginBottom: 5, // Adds a little space between the title and text
  },
  noteText: {
    alignSelf: 'flex-start', // Left aligns the text
    marginBottom: 5, // Adds a little space between the text and date
  },
  noteDate: {
    alignSelf: 'flex-end', // Aligns the date to the right
    marginRight: 10,
  },
});

export default NoteComponent;