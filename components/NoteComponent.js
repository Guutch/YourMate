import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { reusableStyles } from './styles';

const NoteComponent = ({ noteTitle, noteText, noteDate }) => (
  <View style={styles.container}>
    <TouchableOpacity style={[reusableStyles.button, styles.noteButton]}>
      <Text style={styles.noteTitle}>{noteTitle}</Text>
      <Text style={styles.noteText}>{noteText}</Text>
      <Text style={styles.noteDate}>{noteDate}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
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