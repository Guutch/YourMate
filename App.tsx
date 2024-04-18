import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Button, TextInput } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Landing from './screens/Landing'; // Adjust the path as per your directory structure
import SignIn from './screens/SignIn'; // Adjust the path as per your directory structure
import SignUpSwipe from './screens/SignUpSwipe'; // Adjust the path as per your directory structure
import SignUp from './screens/SignUp'; // Adjust the path as per your directory structure
import Createusername from './screens/CreateUsername'; // Adjust the path as per your directory structure
import HabitSelector from './screens/HabitSelector'; // Adjust the path as per your directory structure
import GoalSelector from './screens/GoalSelector'; // Adjust the path as per your directory structure
import ActualGoals from './screens/ActualGoals'; // Adjust the path as per your directory structure
import CreateGoal from './screens/CreateGoal'; // Adjust the path as per your directory structure
import MilestoneAdd from './screens/MilestoneAdd'; // Adjust the path as per your directory structure
import MilestoneInfo from './screens/MIlestoneInfo'; // Adjust the path as per your directory structure
import Housekeeping from './screens/Housekeeping'; // Adjust the path as per your directory structure
import Assessment from './screens/Assessment'; // Adjust the path as per your directory structure
import ResultsScreen from './screens/ResultsScreen'; // Adjust the path as per your directory structure


import Settings from './screens/MainFlow/Settings'; // Adjust the path as per your directory structure
import MainFlow from './MainFlow';

const Stack = createNativeStackNavigator();

const App = () => {
  const [showOverlay, setShowOverlay] = useState(false);


  return (


    <NavigationContainer>

      <Stack.Navigator >
        <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false, gestureEnabled: false }} />
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
          headerShadowVisible: false
        }} />
        <Stack.Screen name="SignUpSwipe" component={SignUpSwipe} options={{
          headerTitle: '', // Removes the title
          headerShadowVisible: false
          // headerRight: () => (
          //   <FontAwesome5 name="cog" size={30} color="#000" />
          //   // <Button title="Update count" />
          // ),
          // FOR INFO ON HOW TO
          // https://reactnavigation.org/docs/header-buttons/
        }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{
          headerTitle: '', // Removes the title
          headerShadowVisible: false
        }} />
        <Stack.Screen name="Assessment" component={Assessment} options={{
          headerTitle: '', // Removes the title
          headerShadowVisible: false
        }} />
        <Stack.Screen name="ResultsScreen" component={ResultsScreen} options={{
          headerTitle: '', // Removes the title
          headerShadowVisible: false
        }} />

        {/* Need to re-use for adding a friend */}
        <Stack.Screen name="Createusername" component={Createusername} options={{
          headerTitle: '', // Removes the title
        }} />
        <Stack.Screen name="HabitSelector" component={HabitSelector} options={{
          headerTitle: '', // Removes the title
          headerShadowVisible: false
        }} />
        <Stack.Screen
          name="GoalSelector"
          component={GoalSelector}
          initialParams={{
            showOverlay: showOverlay,
            setShowOverlay: setShowOverlay // Pass the function to update the state
          }}
          options={({ navigation }) => ({
            headerTitle: '',
            headerShadowVisible: false,
            // headerRight: () => (
            //   <View style={{ flexDirection: 'row' }}>
            //     <TouchableOpacity
            //       onPress={() => navigation.setParams({ color: 'red' })}
            //       style={{ padding: 10, borderRadius: 5 }}
            //     >
            //       <Text style={{ color: 'Black', textAlign: 'center', fontSize: 16 }}>
            //         Skip
            //       </Text>
            //     </TouchableOpacity>
            //   </View>
            // ),
          })}

        />
        <Stack.Screen name="ActualGoals" component={ActualGoals} options={{
          headerTitle: '', // Removes the title
          headerShadowVisible: false
        }} />
        <Stack.Screen name="Housekeeping" component={Housekeeping} options={{
          headerTitle: '', // Removes the title
          headerShadowVisible: false
        }} />
        <Stack.Screen name="CreateGoal" component={CreateGoal}
          options={({ navigation }) => ({
            headerTitle: '', // Removes the title
            headerShadowVisible: false,

          })} />
        <Stack.Screen name="MilestoneInfo" component={MilestoneInfo} options={{
          headerTitle: '', // Removes the title
          headerShadowVisible: false
        }} />
        <Stack.Screen name="MilestoneAdd" component={MilestoneAdd} options={{
          headerTitle: '', // Removes the title
          headerShadowVisible: false
        }} />
        <Stack.Screen
          name="MainFlow"
          component={MainFlow}
          options={{ headerShown: false }}
        //   options={({ navigation }) => ({
        //     headerShadowVisible: false,
        //     headerRight: () => (
        //         <View style={{ flexDirection: 'row' }}>
        //             <Text>Settings</Text>
        //         </View>
        //     ),
        // })}
        />
        <Stack.Screen name="Settings" component={Settings} options={{
          headerTitle: '', // Removes the title
          headerShadowVisible: false
        }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
