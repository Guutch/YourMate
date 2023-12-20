import { StyleSheet, Dimensions } from 'react-native';

// Get the full width of the device
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const reusableStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        // marginBottom: 30, // Space below the header text
        textAlign: 'left', // Center the text
      },
    button: {
        width: 300,
        height: 45,
        backgroundColor: "#0077FF", // Make sure this is a valid color
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'normal',
        marginTop: 9, // Space above the label text
      },
    lessRounded: {
        borderRadius: 10,
    },
    textInput: {
        borderColor: "#000",
        borderWidth: 2,
        width: 335,
        backgroundColor: "#fff",
        padding: 10,
    },
    buttonText: {
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    }
});

const landing = StyleSheet.create({
    mainContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    mainText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
    signInText: {
        fontSize: 15,
        color: 'black',
        marginBottom: 10
    },
    continueContainer: {
        justifyContent: 'flex-end', // Aligns children to the bottom
        alignItems: 'center', // Aligns children horizontally in the center
        width: '100%', // Ensures the container takes the full width
        marginBottom: 25, // Adds some padding at the bottom
    }
});

export { reusableStyles, landing };
