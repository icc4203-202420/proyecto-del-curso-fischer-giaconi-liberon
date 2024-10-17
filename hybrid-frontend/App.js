import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Beer from './app/Beer';
import BeerDetail from './app/BeerDetail';
import BeerReview from './app/BeerReview';
import NavigationBar from './app/NavBar';
import BeerTabs from './app/BeerTabs'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false,}}>
        <Stack.Screen name="Home" component={NavigationBar} />
        <Stack.Screen name="Beer" component={Beer} />
        <Stack.Screen name="BeerDetail" component={BeerDetail} />
        <Stack.Screen name="BeerReview" component={BeerReview} />
        <Stack.Screen name="BeerTabs" component={BeerTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

