import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard, ScrollView, Platform } from 'react-native';
import { reusableStyles, landing, signUp } from '../components/styles'; // Adjust the path

import UserModel from '../firebase/UserModel';

import { app } from '../firebase/firebase'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = ({ navigation }) => {

    // Form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Error messages for invalid form inputs
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // States for password requirements
    const [hasNumberOrSymbol, setHasNumberOrSymbol] = useState(false);
    const [hasMinLength, setHasMinLength] = useState(false);
    const [hasUpperAndLower, setHasUpperAndLower] = useState(false);

    const updatePasswordCriteria = (password) => {
        setHasNumberOrSymbol(/[0-9!@#$%^&*]/.test(password));
        setHasMinLength(password.length >= 8);
        setHasUpperAndLower(/[a-z]/.test(password) && /[A-Z]/.test(password));
    };

    const creatUser = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                // You can perform additional actions here, like navigation or displaying a success message
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // Here you could display an error message or alert to the user
                Alert.alert("Error", errorMessage);
            });
    }

    // Validate email format
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validate password
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

    const validateInput = (inputName, value) => {
        // if (value === '' || value === undefined) {
        // Set the corresponding error message state
        switch (inputName) {
            case 'firstName':
                if (value === '' || value === undefined) {
                    setFirstNameError('First name is required');
                    return true;
                }
                if (/\d/.test(value)) { // Check for numbers in the first name
                    setFirstNameError('First name cannot contain numbers');
                    return true;
                }
                break;
            case 'lastName':
                if (value === '' || value === undefined) {
                    setLastNameError('Last name is required');
                    return true;
                }
                if (/\d/.test(value)) { // Check for numbers in the first name
                    setLastNameError('Last name cannot contain numbers');
                    return true;
                }
                break;
            case 'username':
                console.log(value)
                if (value.length < 3) {
                    setUsernameError('Username must be at least 3 characters');
                    return true;
                }
                // Add check here to see if username is taken
                break;
            case 'email':
                if (value === '' || value === undefined) {
                    setEmailError('Email is required');
                } else {
                    if (!isValidEmail(value)) {
                        setEmailError('Invalid email address');
                        return true;
                    }
                }

                // Add check here to see if email is taken
                break;
            case 'password':
                if (!value) {
                    setPasswordError('Password is required');
                    return true;
                }
                if (!isValidPassword(value)) {
                    setPasswordError('Password must be at least 8 characters, contain a number, symbol, uppercase, and lowercase letter');
                    return true;
                }
                // If the password is valid, reset any existing error messages
                setPasswordError('');
                break;
            case 'confirmPassword':
                if (value === '' || value === undefined) {
                    setConfirmPasswordError('Confirm Password is required');
                    return true;
                }
                if (password !== confirmPassword) {
                    setConfirmPasswordError('Passwords do not match');
                    return true;
                } else {
                    setConfirmPasswordError(''); // Clear the error if passwords match 
                }
                // If confirmPassword is valid (not empty and matches password), reset the error
                setConfirmPasswordError('');
                break;
        }
    };

    const handleSignUp = async () => {
        try {
          const user = await UserModel.createUser(
            firstName,
            lastName,
            username,
            email,
            password
          );
          console.log('User created:', user);
          // Handle successful user creation
          navigation.navigate('HabitSelector');
        } catch (error) {
          console.error('Error creating user:', error);
          // Handle error
          if (error.message === 'Email already in use') {
            setEmailError('Email is already taken');
          } else if (error.message === 'Username already in use') {
            setUsernameError('Username is already taken');
          } else {
            Alert.alert('Error', error.message);
          }
        }
      };

    const validation = () => {
        let isFormInvalid = false;

        // Validate each input
        if (validateInput('firstName', firstName)) isFormInvalid = true;
        if (validateInput('lastName', lastName)) isFormInvalid = true;
        if (validateInput('username', username)) isFormInvalid = true;
        if (validateInput('email', email)) isFormInvalid = true;
        if (validateInput('password', password)) isFormInvalid = true;
        if (validateInput('confirmPassword', confirmPassword)) isFormInvalid = true;

        if (isFormInvalid) {
            console.log("Invalid Form"); // All inputs are valid
            // Proceed with form submission
        } else {
            handleSignUp();
            // const user = await UserModel.createUser(email, password);
            // console.log("Valid form input - can create user")
            // navigation.navigate('HabitSelector')
            // onPress={() => 
        }
    };

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

    return (
        <KeyboardAvoidingView
            behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}
            style={[reusableStyles.container, { flex: 1, alignItems: 'center' }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                {/* Header Text */}
                <Text style={[reusableStyles.headerText, { marginBottom: 9 }]}>
                    Sign up to Your Mate
                </Text>


                {/* Name Group */}
                <View style={{ marginBottom: 9 }}>
                    <View style={signUp.row}>
                        <View>
                            <Text style={[reusableStyles.labelText, { marginBottom: 10 }]}>
                                First Name
                            </Text>
                            <TextInput
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, signUp.halfInput, { height: 44, borderColor: firstNameError ? 'red' : 'black' }]}
                                value={firstName}
                                onChangeText={text => {
                                    setFirstName(text)
                                    setFirstNameError(''); // Clear error on input change
                                }}
                                placeholder="Enter first name"
                            // Add other TextInput props (keyboardType, etc.)
                            />
                            <View>
                                {firstNameError ? <Text style={[signUp.smallText, signUp.halfInput, { color: 'red' }]}>{firstNameError}</Text> : null}
                            </View>
                        </View>
                        <View style={{ marginLeft: 15 }}>
                            <Text style={[reusableStyles.labelText, { marginBottom: 10 }]}>
                                Last Name
                            </Text>
                            <TextInput
                                style={[reusableStyles.textInput, reusableStyles.lessRounded, signUp.halfInput, { height: 44, borderColor: lastNameError ? 'red' : 'black' }]}
                                value={lastName}
                                onChangeText={text => {
                                    setLastName(text)
                                    setLastNameError(''); // Clear error on input change
                                }}
                                placeholder="Enter last name"
                            />
                            {/* Small Text */}
                            <View>
                                {lastNameError ? <Text style={[signUp.smallText, signUp.halfInput, { color: 'red' }]}>{lastNameError}</Text> : null}
                            </View>
                        </View>
                    </View>

                </View>

                {/* Username Group */}
                <View style={{ marginBottom: 9 }}>
                    <Text style={[reusableStyles.labelText, { marginBottom: 10 }]}>
                        Username
                    </Text>
                    <TextInput
                        style={[reusableStyles.textInput, reusableStyles.lessRounded, { height: 44, borderColor: usernameError ? 'red' : 'black' }]}
                        value={username}
                        onChangeText={text => {
                            setUsername(text)
                            setUsernameError(''); // Clear error on input change
                        }}
                        placeholder="Enter Username"
                    // Add other TextInput props
                    />
                    {/* <View>
                        <Text style={signUp.smallText}>At least 3 characters</Text>
                    </View> */}
                    <View>
                        {usernameError ? <Text style={[signUp.smallText, { color: 'red' }]}>{usernameError}</Text> : null}
                    </View>
                </View>

                {/* Email Group */}
                <View style={{ marginBottom: 9 }}>
                    <Text style={[reusableStyles.labelText, { marginBottom: 10 }]}>
                        Email
                    </Text>
                    <TextInput
                        style={[reusableStyles.textInput, reusableStyles.lessRounded, { height: 44, borderColor: emailError ? 'red' : 'black' }]}
                        value={email}
                        onChangeText={text => {
                            setEmail(text)
                            setEmailError(''); // Clear error on input change
                        }}
                        placeholder="Enter email"
                        keyboardType="email-address"
                    />
                    {/* Small Text */}
                    <View>
                        {emailError ? <Text style={[signUp.smallText, signUp.halfInput, { color: 'red' }]}>{emailError}</Text> : null}
                    </View>
                </View>

                {/* Password Group */}
                <View style={{ marginBottom: 9 }}>
                    <Text style={[reusableStyles.labelText, { marginBottom: 10 }]}>
                        Password
                    </Text>
                    <TextInput
                        style={[reusableStyles.textInput, reusableStyles.lessRounded, { height: 44, borderColor: passwordError ? 'red' : 'black' }]}
                        value={password}
                        onChangeText={text => {
                            setPassword(text);
                            setPasswordError('');
                            updatePasswordCriteria(text);
                        }}
                        placeholder="Enter password"
                        secureTextEntry
                    // Add other TextInput props
                    />
                    {/* Small Text */}
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

                </View>

                {/* Confirm Password Group */}
                <View style={{ marginBottom: 9 }}>
                    <Text style={[reusableStyles.labelText, { marginBottom: 10 }]}>
                        Confirm Password
                    </Text>
                    <TextInput
                        style={[reusableStyles.textInput, reusableStyles.lessRounded, { height: 44, borderColor: confirmPasswordError ? 'red' : 'black' }]}
                        value={confirmPassword}
                        onChangeText={text => {
                            setConfirmPassword(text)
                            setConfirmPasswordError(''); // Clear error on input change
                        }}
                        placeholder="Re-enter password"
                        secureTextEntry
                    />
                    <View>
                        {confirmPasswordError ? <Text style={[signUp.smallText, { color: 'red' }]}>{confirmPasswordError}</Text> : null}
                    </View>
                </View>

                {/* Sign up Button */}
                <TouchableOpacity style={[reusableStyles.button, { backgroundColor: '#0077FF', marginTop: 15, borderWidth: 1, width: 335 }]}
                    onPress={validation}
                >
                    <Text style={reusableStyles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </ScrollView>

        </KeyboardAvoidingView>
    );
};

export default SignUp;