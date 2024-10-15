import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './app/SignUp';
import LogIn from './app/LogIn';
import Home from './app/Home';
import Beer from './app/Beer';
import BeerDetail from './app/BeerDetail';
import BeerReview from './app/BeerReview';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LogIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Beer" component={Beer} />
        <Stack.Screen name="BeerDetail" component={BeerDetail} />
        <Stack.Screen name="BeerReview" component={BeerReview} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

