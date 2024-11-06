import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ConsultaFormScreen from './src/screens/ConsultaFormScreen';

const Stack = createNativeStackNavigator();

function App() {
  return(
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='ConsultaForm' component={ConsultaFormScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;