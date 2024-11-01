import React, { useState } from 'react';
import { View, TextInput, Button,StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddNoteScreen = ({ navigation }) => {
  const [note, setNote] = useState('');
  const [title, setTitle] = useState('');
  const [timestamp,setTimestamp]=useState('');

  const saveNote = async () => {

    if (title.trim() === '' || note.trim() === '') {
      alert('Please enter both title and note.');
      return;
    }

    const savedNotes = await AsyncStorage.getItem('notes');
    const notes = savedNotes ? JSON.parse(savedNotes) : [];
    notes.unshift({title,note,timestamp: new Date().toISOString()});
    await AsyncStorage.setItem('notes', JSON.stringify(notes));
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
      <TextInput
        placeholder="Type your note here"
        multiline
        value={note}
        onChangeText={setNote}
        style={{
          borderBottomWidth: 1,
          marginBottom: 20,
          borderColor: 'transparent',
          borderWidth: 0,
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 4,
          marginTop: 20,
          textAlignVertical: 'top',
          fontSize:15
        }}
      />
      </ScrollView>
      <Button title="Save Note" onPress={saveNote} />
    </View>
  );
};

const styles = StyleSheet.create({
  titleInput: {
    borderColor: 'transparent',
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    textAlignVertical: 'top',
    fontSize:18
  },
});
export default AddNoteScreen;
