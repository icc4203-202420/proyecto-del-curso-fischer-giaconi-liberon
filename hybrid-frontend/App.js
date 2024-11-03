import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { AuthProvider } from './app/AuthContext';
import Beer from './app/Beer';
import BeerDetail from './app/BeerDetail';
import BeerReview from './app/BeerReview';
import NavigationBar from './app/NavBar';
import BeerTabs from './app/BeerTabs';
import SignUp from './app/SignUp';
import LogIn from './app/LogIn';
import SearchUserBar from './app/UserSearch';
import Events from './app/Events';
import Bars from './app/Bar';
import Attendance from './app/Attendance';
import AddAttendance from './app/AddAttendance';
import UserDetail from './app/UserDetail';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={!!(SecureStore.getItem('token')) ? "Home" : "LogIn"} screenOptions={{headerShown: false,}}>
          <Stack.Screen name="Home" component={NavigationBar} />
          <Stack.Screen name="Beer" component={Beer} />
          <Stack.Screen name="BeerDetail" component={BeerDetail} />
          <Stack.Screen name="BeerReview" component={BeerReview} />
          <Stack.Screen name="BeerTabs" component={BeerTabs} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="LogIn" component={LogIn} />
          <Stack.Screen name="SearchUser" component={SearchUserBar} />
          <Stack.Screen name="UserDetail" component={UserDetail} />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="Bar" component={Bars} />
          <Stack.Screen name="Attendance" component={Attendance} />
          <Stack.Screen name="AddAttendance" component={AddAttendance} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

