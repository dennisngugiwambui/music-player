import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [sound, setSound] = React.useState(null);
  const [musicFiles, setMusicFiles] = React.useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);

  const loadAudio = async () => {
    try {
      const currentFile = musicFiles[currentTrackIndex]?.uri;
      if (!currentFile) {
        console.log('Error: Music file URI is undefined');
        return;
      }
      const { sound } = await Audio.Sound.createAsync({ uri: currentFile }, {}, onPlaybackStatusUpdate);
      setSound(sound);
      setIsPlaying(true);
    } catch (error) {
      console.log('Error loading audio:', error);
    }
  };

  const playNextTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    const nextIndex = (currentTrackIndex + 1) % musicFiles.length;
    setCurrentTrackIndex(nextIndex);
    loadAudio();
  };

  const playPreviousTrack = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    const previousIndex = (currentTrackIndex - 1 + musicFiles.length) % musicFiles.length;
    setCurrentTrackIndex(previousIndex);
    loadAudio();
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (sound.getStatusAsync().isLoaded) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      } else {
        console.log('Sound is not loaded yet.');
      }
    }
  };
  

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && status.isPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  React.useEffect(() => {
    const fetchMusicFiles = async () => {
      try {
        const musicFiles = [
          {
            title: 'Song 1',
            artist: 'Unknown',
            uri: 'https://example.com/song1.mp3',
          },
          {
            title: 'Song 2',
            artist: 'Unknown',
            uri: 'https://example.com/song2.mp3',
          },
          // Add more music files as needed
        ];

        setMusicFiles(musicFiles);
      } catch (error) {
        console.log('Error fetching music files:', error);
      }
    };

    fetchMusicFiles();
  }, []);

  React.useEffect(() => {
    if (musicFiles.length > 0) {
      loadAudio();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [musicFiles]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/album_cover.png')} style={styles.albumCover} />

      <View style={styles.songDetailsContainer}>
        <Text style={styles.songTitle}>{musicFiles[currentTrackIndex]?.title}</Text>
        <Text style={styles.artistName}>{musicFiles[currentTrackIndex]?.artist}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={playPreviousTrack}>
          <Ionicons name="play-skip-back-outline" size={30} color="black" />
        </TouchableOpacity>

        {sound && (
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={playNextTrack}>
          <Ionicons name="play-skip-forward-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumCover: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  songDetailsContainer: {
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 18,
    color: 'gray',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '60%',
  },
  playButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 50,
  },
});

export default HomeScreen;
