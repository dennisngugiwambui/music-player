import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/index';
import FilesScreen from './screens/FileScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <Ionicons
                name="folder-open-outline"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate('Files')}
              />
            ),
          })}
        />
        <Stack.Screen name="Files" component={FilesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
