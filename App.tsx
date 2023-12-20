import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Landing from './screens/Landing'; // Adjust the path as per your directory structure
import SignIn from './screens/SignIn'; // Adjust the path as per your directory structure
import SignUpSwipe from './screens/SignUpSwipe'; // Adjust the path as per your directory structure

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false, gestureEnabled: false }}/>
        {/* <Stack.Screen name="Landing" component={Landing} options={{
          title: 'Welcome', // Set the title for the header
          headerStyle: {
            backgroundColor: '#f4511e', // Customize background color
          },
          headerTintColor: '#fff', // Customize back button and title color
          headerTitleStyle: {
            fontWeight: 'bold', // Customize title font weight
          },
          // You can also hide the header entirely by setting `headerShown: false`
        }} /> */}
        <Stack.Screen name="SignIn" component={SignIn} options={{
            headerTitle: '', // Removes the title
          }} />
        <Stack.Screen name="SignUpSwipe" component={SignUpSwipe} options={{
            headerTitle: '', // Removes the title
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
