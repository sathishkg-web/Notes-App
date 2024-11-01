import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditNoteScreen = ({ route, navigation }) => {
  const { note } = route.params;
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.note);
  const [lastModified, setLastModified]=useState(new Date().toISOString());

  const handleSave = async () => {
    if (title.trim() === '' || content.trim() === '') {
      Alert.alert('Error', 'Please enter both title and note.');
      return;
    }

    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      const notes = savedNotes ? JSON.parse(savedNotes) : [];
      const updatedNotes = notes.map((n) =>
        n.title === note.title && n.note === note.note
          ? { title, note: content, timestamp: lastModified }
          : n
      );
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  return (
    <View style={styles.container}>
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
        value={content}
        onChangeText={setContent}
        style={styles.noteInput}
      />
      </ScrollView>
      <Button title="Save Note" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleInput: {
    borderColor:'transparent',
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 9,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    fontSize:18,
    fontWeight:'bold'
  },
  noteInput: {
    borderBottomWidth: 1,
    marginBottom: 20,
    borderColor: 'transparent',
    borderWidth: 0,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginTop: 20,
    textAlignVertical: 'top',
    fontSize: 15,
  },
});

export default EditNoteScreen;
