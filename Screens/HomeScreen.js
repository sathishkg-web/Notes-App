import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    };

    const unsubscribe = navigation.addListener('focus', loadNotes);

    return unsubscribe;
  }, [navigation]);

  const handleDelete = async () => {
    const updatedNotes = notes.filter((note) => note !== selectedNote);
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    setModalVisible(false);
  };

  const formatTimestamp = (timestamp) => {
        const noteDate = new Date(timestamp);
    const now = new Date();

    // Extracting date parts for comparison
    const noteDay = noteDate.getDate();
    const noteMonth = noteDate.getMonth();
    const noteYear = noteDate.getFullYear();

    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Check if the note date is before the current date
    if (noteYear < currentYear || noteMonth < currentMonth || noteDay < currentDay) {
      // If the note was created on a previous day, show the date
      return noteDate.toLocaleDateString();
    } else {
      // If the note was created today, show the time
      return noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Add Note" onPress={() => navigation.navigate('AddNote')} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Detail', { item });
            }}
            onLongPress={() => {
              setSelectedNote(item);
              setModalVisible(true);
            }}>
            <View
              style={{
                padding: 20,
                borderWidth: 1,
                borderColor: 'grey',
                borderRadius: 6,
                marginVertical: 4,
                maxHeight: 200,
                overflow: 'hidden',
                position:'relative'
              }}>
              <Text
                style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>
                {item.title}
              </Text>
              <Text>{item.note}</Text>
              <Text style={styles.timestamp}>
              {formatTimestamp(item.timestamp)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text>Do you want to delete this note?</Text>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button title="Delete" onPress={handleDelete} />
              </View>
              <View style={styles.button}>
                <Button
                  title="Edit"
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('EditNote', { note: selectedNote });
                  }}
                />
              </View>
              <View style={styles.button}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    // block: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // padding: 20,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '35%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    marginVertical: 10,
  },
  timestamp: {
    bottom: 14,
    fontSize: 13,
    color: 'grey',
    right:10,
    position:'absolute',
  }
});

export default HomeScreen;
