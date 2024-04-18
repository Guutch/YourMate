import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView, Platform, Touchable } from 'react-native';
import { reusableStyles, communityMain, signUp } from '../../components/styles';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { app } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth';

import UserModel from '../../firebase/UserModel'

import { setUserData } from '../../components/DataManager';

const auth = getAuth(app);
const Settings = ({ navigation }) => {
  const userId = auth.currentUser.uid;

  const [completedBlocks, setCompletedBlocks] = useState(0);
  const [completedGoals, setCompletedGoals] = useState(0);
  const [completedUserData, setCompletedUserData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');
  const [initialUsername, setInitialUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [initialOldEmail, setInitialOldEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [habits, setHabits] = useState([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // States for password requirements
  const [hasNumberOrSymbol, setHasNumberOrSymbol] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUpperAndLower, setHasUpperAndLower] = useState(false);

  useEffect(() => {
    let timer;
    if (showSuccessMessage) {
      timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessMessage]);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPassword = (password) => {
    const hasNumber = /\d/;
    const hasSymbol = /[!@#$%^&*]/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    return (
      password.length >= 8 &&
      hasNumber.test(password) &&
      hasSymbol.test(password) &&
      hasUpperCase.test(password) &&
      hasLowerCase.test(password)
    );
  };

  const updatePasswordCriteria = (password) => {
    setHasNumberOrSymbol(/[0-9!@#$%^&*]/.test(password));
    setHasMinLength(password.length >= 8);
    setHasUpperAndLower(/[a-z]/.test(password) && /[A-Z]/.test(password));
  };

  const [selectedHabits, setSelectedHabits] = useState([]);
  const availableHabits = ['porn', 'procrastination', 'general', 'gambling'];
  const [selectedHabitToRemove, setSelectedHabitToRemove] = useState(null);

  const handleHabitSelection = (habit) => {
    if (selectedHabits.includes(habit)) {
      // Remove the habit from the selectedHabits array
      setSelectedHabits(selectedHabits.filter((h) => h !== habit));
    } else {
      // Add the habit to the selectedHabits array
      setSelectedHabits([...selectedHabits, habit]);
    }
  };

  const handleSave = async () => {
    try {
      let isValid = true;
      switch (modalType) {
        case 'name':
          // Validate first name and last name
          if (/\d/.test(newFirstName)) {
            setFirstNameError('Error, incorrect value');
            isValid = false;
            return;
          } else if (newFirstName.trim() === '') {
            setFirstNameError('First name cannot be empty');
            isValid = false;
            return;
          } else {
            setFirstNameError('');
          }

          if (/\d/.test(newLastName)) {
            setLastNameError('Error, incorrect value');
            isValid = false;
            return;
          } else if (newLastName.trim() === '') {
            setLastNameError('Last name cannot be empty');
            isValid = false;
            return;
          } else {
            setLastNameError('');
          }

          if (isValid) {
            await UserModel.updateUserFirstLastName(userId, newFirstName, newLastName);
            setInitialFirstName(newFirstName);
            setInitialLastName(newLastName);
            setUserData({ firstName: newFirstName })
            setUserData({ lastName: newLastName })
            setShowModal(false); // Close the modal after successful update
          }
          break;
        case 'username':
          console.log(newUsername);
          if (newUsername.trim() === '') {
            setUsernameError('Username cannot be empty');
            isValid = false;
            return;
          } else {
            const isUsernameAvailable = await UserModel.updateUsername(userId, newUsername);
            if (isUsernameAvailable) {
              setUsernameError('');
              setInitialUsername(newUsername);
              setUserData({ username: newUsername })
            } else {
              setUsernameError('Username is already taken');
              isValid = false;
              return;
            }
          }
          break;
        case 'password':
          if (currentPassword.trim() === '') {
            setPasswordError('Current password cannot be empty');
            isValid = false;
            return;
          }
          if (newPassword.trim() === '') {
            setPasswordError('New password cannot be empty');
            isValid = false;
            return;
          }
          if (newPassword !== confirmNewPassword) {
            setPasswordError('New password and confirm new password do not match');
            isValid = false;
            return;
          }
          const isValidNewPassword = isValidPassword(newPassword);
          if (!isValidNewPassword) {
            setPasswordError(
              'New password must be at least 8 characters long and contain at least one number, one symbol, one uppercase letter, and one lowercase letter'
            );
            isValid = false;
            return;
          }

          const { error } = await UserModel.changePassword(currentPassword, newPassword);
          if (error) {
            setPasswordError(error);
            isValid = false;
            return;
          } else {
            clearThings();


            // Handle any additional, logic after the password change, like closing the modal
          }
          break;
        case 'email':
          // Validate email
          if (!isValidEmail(newEmail)) {
            setEmailError('Invalid email format');
            isValid = false;
            return;
          } else if (newEmail.trim() === '') {
            setEmailError('New email cannot be empty.');
            isValid = false;
            return;
          } else if (newEmail === oldEmail) {
            setEmailError('New email cannot be the same as old email.');
            isValid = false;
            return;
          } else if (initialOldEmail != oldEmail) {
            setEmailError('Old email does not match current email');
            isValid = false;
            return;
          }
          else {
            const updateSuccessful = await UserModel.updateEmail(userId, newEmail);

            if (updateSuccessful) {
              // Update states since the change was successful
              setNewEmail('');
              setOldEmail('');
              setInitialOldEmail(newEmail);
              setShowSuccessMessage(true);
            } else {
              // error
              setEmailError('Email taken..');
              isValid = false;
              return;
            }
          }
          break;
        case 'habits':
          console.log('Selected Habits: ', selectedHabits);

          try {
            // Get the existing habit names from the habits state
            const existingHabitNames = habits.map((habit) => habit.name);

            // Filter out the habits that already exist
            const newHabits = selectedHabits.filter(
              (habitName) => !existingHabitNames.includes(habitName)
            );

            // Add the new habits to the user's habits collection
            await Promise.all(
              newHabits.map(async (habitName) => {
                await UserModel.addHabit(userId, habitName);
              })
            );

            // Fetch the updated habits from the backend
            const updatedHabits = await UserModel.fetchUserHabit(userId);
            setHabits(updatedHabits);
            setUserData({ habit: 'yes' })
            setSelectedHabits([])

          } catch (error) {
            console.error('Error adding habits:', error);
            isValid = false;
          }
          break;
        case 'removeHabits':
          console.log('Habits to Remove:', selectedHabitToRemove);

          try {
            // await Promise.all(
            //   habitsToRemove.map(async (selectedHabitToRemove) => {
            await UserModel.removeHabit(userId, selectedHabitToRemove);
            //   })
            // );

            // Fetch the updated habits from the backend
            const updatedHabits = await UserModel.fetchUserHabit(userId);
            setHabits(updatedHabits);
            setSelectedHabitToRemove([]);
            setUserData({ habit: 'yes' })
          } catch (error) {
            console.error('Error removing habits:', error);
            isValid = false;
          }

        // break;
        default:
          break;
      }

      setShowSuccessMessage(true);
      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'name':
        return (
          <View>
            <Text style={{ marginBottom: 10, color: '#000' }}>First Name</Text>
            <TextInput
              value={newFirstName}
              onChangeText={(text) => {
                setNewFirstName(text);
                if (text.trim() !== '' && !/\d/.test(text)) {
                  setFirstNameError('');
                }
              }}
              style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
            />
            {firstNameError !== '' && <Text style={{ color: 'red' }}>{firstNameError}</Text>}

            <Text style={{ marginBottom: 10, marginTop: 20, color: '#000' }}>Last Name</Text>
            <TextInput
              value={newLastName}
              onChangeText={(text) => {
                setNewLastName(text);
                if (text.trim() !== '' && !/\d/.test(text)) {
                  setLastNameError('');
                }
              }}
              style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
            />
            {lastNameError !== '' && <Text style={{ color: 'red' }}>{lastNameError}</Text>}

          </View>
        );
      case 'username':
        return (
          <View>
            <Text style={{ marginBottom: 20, color: '#000' }}>Enter New Username</Text>
            <TextInput
              value={newUsername}
              onChangeText={(text) => {
                setNewUsername(text);
                if (text.trim() !== '') {
                  setUsernameError('');
                }
              }}
              style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
            />
            {usernameError !== '' && <Text style={{ color: 'red' }}>{usernameError}</Text>}

          </View>
        );
      case 'password':
        return (
          <View>
            <Text style={{ marginBottom: 10, color: '#000' }}>Current Password</Text>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}

            />
            <Text style={{ marginBottom: 10, marginTop: 20, color: '#000' }}>New Password</Text>
            <TextInput
              value={newPassword}
              onChangeText={text => {
                setNewPassword(text)
                updatePasswordCriteria(text);
              }}
              secureTextEntry
              style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}

            />
            <View>
              {passwordError ? (
                <Text style={[signUp.smallText, { color: 'red' }]}>{passwordError}</Text>
              ) : (
                <>
                  <Text style={[signUp.smallText, hasNumberOrSymbol ? { color: 'green' } : { color: 'red' }]}>
                    At least one number (0-9) or a symbol
                  </Text>
                  <Text style={[signUp.smallText, hasMinLength ? { color: 'green' } : { color: 'red' }]}>
                    At least 8 characters
                  </Text>
                  <Text style={[signUp.smallText, hasUpperAndLower ? { color: 'green' } : { color: 'red' }]}>
                    Lowercase (a-z) and uppercase (A-Z)
                  </Text>
                </>
              )}
            </View>
            <Text style={{ marginBottom: 10, marginTop: 20, color: '#000' }}>Confirm New Password</Text>
            <TextInput
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              secureTextEntry
              style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
            />
            <View style={{ width: "80%" }}>
              {passwordError !== '' && <Text style={{ color: 'red' }}>{passwordError}</Text>}

            </View>
          </View>
        );
      case 'email':
        return (
          <View>
            <Text style={{ marginBottom: 10, color: '#000' }}>Old Email</Text>
            <TextInput
              value={oldEmail}
              onChangeText={(text) => {
                setOldEmail(text);
                if (text.trim() !== '' && isValidEmail(text) && text !== newEmail) {
                  setEmailError('');
                }
              }}
              style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
            />
            <Text style={{ marginBottom: 10, marginTop: 20, color: '#000' }}>New Email</Text>
            <TextInput
              value={newEmail}
              onChangeText={(text) => {
                setNewEmail(text);
                if (text.trim() !== '' && isValidEmail(text) && text !== oldEmail) {
                  setEmailError('');
                }
              }}
              style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
            />

            {emailError !== '' && <Text style={{ color: 'red' }}>{emailError}</Text>}
          </View>
        );
      case 'habits':
        return (
          <View>
            <Text style={{ marginBottom: 20, color: '#000' }}>Select Habits</Text>
            {availableHabits
              .filter((habit) => !habits.some((h) => h.name === habit))
              .map((habit) => (
                <TouchableOpacity
                  key={habit}
                  onPress={() => handleHabitSelection(habit)}
                  style={[
                    reusableStyles.textInput,
                    reusableStyles.moreRounded,
                    { marginBottom: 5, backgroundColor: selectedHabits.includes(habit) ? '#0077FF' : 'transparent' },
                  ]}
                >
                  <Text
                    style={{
                      color: selectedHabits.includes(habit) ? 'white' : 'black',
                      textAlign: 'center',
                    }}
                  >
                    {habit}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        );
      case 'removeHabits':
        return (
          <View>
            <Text style={{ marginBottom: 20 }}>Select Habit to Remove</Text>
            {habits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                onPress={() => setSelectedHabitToRemove(selectedHabitToRemove === habit.id ? null : habit.id)}
                style={[
                  reusableStyles.textInput,
                  reusableStyles.moreRounded,
                  { marginBottom: 5, backgroundColor: selectedHabitToRemove === habit.id ? '#0077FF' : 'transparent' },
                ]}
              >
                <Text
                  style={{
                    color: selectedHabitToRemove === habit.id ? 'white' : 'black',
                    textAlign: 'center',
                  }}
                >
                  {habit.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  const numberOfCompleted = (blocks) => {
    let completed = 0;
    const todaysDate = new Date();

    for (const block of blocks) {
      const blockDate = new Date(block.date);
      // console.log("Block: ", block);

      // Get yesterday's date
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);

      // Check if the dates match (only the date portion)
      if (
        blockDate.getFullYear() === todaysDate.getFullYear() &&
        blockDate.getMonth() === todaysDate.getMonth() &&
        blockDate.getDate() === todaysDate.getDate()
      ) {
        // Calculate block endTime
        const blockStartTime = new Date();
        blockStartTime.setHours(block.startingTime.hours, block.startingTime.minutes);
        const blockEndTime = new Date(blockStartTime);
        blockEndTime.setMinutes(blockStartTime.getMinutes() + block.duration.minutes);
        blockEndTime.setHours(blockEndTime.getHours() + block.duration.hours);

        // Compare blockEndTime with the current time
        const currentTime = new Date();
        if (blockEndTime < currentTime) {
          console.log(`Block with ID ${block.id} ended in the past`);
          completed++;
        } else {
          console.log(`Block with ID ${block.id} ends in the future`);
        }
      } else if (
        blockDate.getFullYear() === yesterdayDate.getFullYear() &&
        blockDate.getMonth() === yesterdayDate.getMonth() &&
        blockDate.getDate() === yesterdayDate.getDate()
      ) {
        // Calculate block endTime
        const blockStartTime = new Date();
        blockStartTime.setHours(block.startingTime.hours, block.startingTime.minutes);
        const blockEndTime = new Date(blockStartTime);
        blockEndTime.setMinutes(blockStartTime.getMinutes() + block.duration.minutes);
        blockEndTime.setHours(blockEndTime.getHours() + block.duration.hours);

        // Compare blockEndTime with the current time
        const currentTime = new Date();
        if (blockEndTime > currentTime) {
          console.log(`Block with ID ${block.id} ends in the future`);
        } else {
          console.log(`Block with ID ${block.id} ended in the past`);
          completed++;
        }
      } else if (blockDate < todaysDate) {
        console.log(`Block with ID ${block.id} ended in the past`);
        completed++;
      }
    }

    return completed;
  };

  const goalsCompleted = (goals) => {
    let completed = 0;

    for (const goal of goals) {
      if (goal.status == "Completed") {
        completed++;
      }

    }

    return completed;
  }

  const handleAssessmentPress = (habitName) => {
    navigation.navigate('Assessment', { isSignUp: false, habit: habitName });
  };

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const blocks = await UserModel.fetchUserBlocks(userId);
        const goals = await UserModel.fetchUserGoals(userId);
        const habits = await UserModel.fetchUserHabit(userId);
        const data = await UserModel.fetchUserData(userId);
        const completedBlocksCount = numberOfCompleted(blocks)
        const completedGoalsCount = goalsCompleted(goals)
        setCompletedBlocks(completedBlocksCount);
        setCompletedGoals(completedGoalsCount);
        setCompletedUserData(data);
        setInitialFirstName(data.firstName);
        setNewFirstName(data.firstName);
        setInitialLastName(data.lastName);
        setNewLastName(data.lastName);
        setInitialUsername(data.username);
        setNewUsername(data.username);
        setInitialOldEmail(data.email)
        setHabits(habits)
      } catch (error) {
        console.log('Error fetching blocks:', error);
      }
    };

    fetchBlocks();
  }, [userId]);

  const clearThings = () => {
    setUsernameError('')
    setFirstNameError('')
    setLastNameError('')
    setEmailError('')
    setPasswordError('')
    setNewPassword('')
    setConfirmNewPassword('')
    setCurrentPassword('')
    setHasNumberOrSymbol(false)
    setHasMinLength(false)
    setHasUpperAndLower(false)
  }

  const handleCancel = () => {
    setNewFirstName(initialFirstName);
    setNewLastName(initialLastName);
    setNewUsername(initialUsername);
    setShowModal(false);
    setSelectedHabitToRemove(null)
    setSelectedHabits([])
    clearThings()
  };

  const logoutUser = async () => {
    try {
      await auth.signOut();
      // Navigate to the 'Landing' screen after successful logout
      navigation.navigate('Landing');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={[reusableStyles.container, { alignItems: 'center' }]}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 }}>
        <View style={styles.box}>
          <FontAwesome5 name="trophy" size={24} color="#FFD700" style={styles.icon} />
          <Text style={styles.counter}>{completedGoals}</Text>
          <Text style={styles.text}>Completed Goals</Text>
        </View>
        <View style={styles.box}>
          <FontAwesome5 name="trophy" size={24} color="#FFD700" style={styles.icon} />
          <Text style={styles.counter}>{completedBlocks}</Text>
          <Text style={[styles.text]}>Completed Blocks</Text>
        </View>
      </View>
      {showSuccessMessage && (
        <Text style={{ color: 'green', fontWeight: 'bold' }}>
          Changes have been saved!
        </Text>
      )}


      <TouchableOpacity
        style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginVertical: 5 }]}
        onPress={() => {
          setModalType('name');
          setShowModal(true);
        }}
      >
        <Text style={{ textAlign: 'center', color: '#000' }}>Change Name</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
        onPress={() => {
          setModalType('username');
          setShowModal(true);
        }}
      >
        <Text style={{ textAlign: 'center', color: '#000' }}>Change Username</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
        onPress={() => {
          setModalType('password');
          setShowModal(true);
        }}
      >
        <Text style={{ textAlign: 'center', color: '#000' }}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
        onPress={() => {
          setModalType('email');
          setShowModal(true);
        }}
      >
        <Text style={{ textAlign: 'center', color: '#000' }}>Change Email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
        onPress={() => {
          setModalType('habits');
          setShowModal(true);
        }}
      >
        <Text style={{ textAlign: 'center', color: '#000' }}>Add A Habit</Text>
      </TouchableOpacity>
      {habits.length > 1 && ( // Only render if habits.length is not 1
        <TouchableOpacity
          style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
          onPress={() => {
            setModalType('removeHabits');
            setShowModal(true);
          }}
        >
          <Text style={{ textAlign: 'center', color: '#000' }}>Remove A Habit</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
        onPress={logoutUser}
      >
        <Text style={{ textAlign: 'center', color: '#000' }}>Log Out</Text>
      </TouchableOpacity>
      {habits.map((habit) => (
        <TouchableOpacity
          key={habit.id}
          style={[reusableStyles.textInput, reusableStyles.moreRounded, { marginBottom: 5 }]}
          onPress={() => handleAssessmentPress(habit.name)}
        >
          <Text style={{ textAlign: 'center', color: '#000', textTransform: 'capitalize' }}>Take Assessment - {habit.name}</Text>
        </TouchableOpacity>
      ))}



      <Modal visible={showModal} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {renderModalContent()}
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.text}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );


};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20, // Adjust the padding as needed
  },
  box: {
    alignItems: 'center', // Center the content of the boxes
    padding: 10, // Adjust the padding as needed
    borderWidth: 2, // Add a border to make the box visible
    borderColor: '#000', // Light grey border
    borderRadius: 10, // Rounded corners
    margin: 5
  },
  icon: {
    marginBottom: 10, // Space between icon and counter
  },
  counter: {
    fontSize: 24, // Large font size for the counter
    fontWeight: 'bold', // Make the counter bold
    marginBottom: 10, // Space between counter and text
    color: '#000'
  },
  text: {
    textAlign: 'center', // Center the text
    color: '#000'
  },
});
export default Settings;