import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const FilesScreen = ({ navigation }) => {
  const [musicFiles, setMusicFiles] = useState([]);

  useEffect(() => {
    fetchMusicFiles();
  }, []);

  const fetchMusicFiles = async () => {
    try {
      const { uri } = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
      const files = await FileSystem.readDirectoryAsync(uri);
      const musicFiles = files.filter((file) => file.endsWith('.mp3'));
      setMusicFiles(musicFiles);
    } catch (error) {
      console.log('Error fetching music files:', error);
    }
  };

  const handleFilePress = async (file) => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: `${FileSystem.documentDirectory}${file}` });
      await soundObject.playAsync();
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={musicFiles}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.fileItem} onPress={() => handleFilePress(item)}>
            <Text style={styles.fileName}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  fileItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  fileName: {
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
});

export default FilesScreen;
